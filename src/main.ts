import {Notice, Plugin, WorkspaceLeaf} from 'obsidian';
import {DEFAULT_SETTINGS, RssFeed, RssReaderSettings, RSSReaderSettingsTab} from "./settings/settings";
import ViewLoader from "./view/ViewLoader";
import {
    configuredFeedsStore,
    settingsStore,
    feedsStore,
    sortedFeedsStore,
    filteredStore, filteredItemsStore, FilteredFolderContent, foldedState, tagsStore
} from "./stores";
import {VIEW_ID} from "./consts";
import {getFeedItems, RssFeedContent, RssFeedItem} from "./parser/rssParser";
import {addFeatherIcon} from "obsidian-community-lib";
import groupBy from "lodash.groupby";
import mergeWith from "lodash.mergewith";
import keyBy from "lodash.keyby";
import values from "lodash.values";
import {FilteredFolder, FilterType, SortOrder} from "./modals/FilteredFolderModal";
import {Md5} from "ts-md5";
import t from "./l10n/locale";

export default class RssReaderPlugin extends Plugin {
    settings: RssReaderSettings;

    async onload(): Promise<void> {
        console.log('loading plugin rss reader');

        addFeatherIcon("rss");
        addFeatherIcon("eye");
        addFeatherIcon("eye-off");
        addFeatherIcon("star");
        addFeatherIcon("clipboard");
        addFeatherIcon("headphones");
        addFeatherIcon("chevron-down");

        //update settings whenever store contents change.
        this.register(
            settingsStore.subscribe((value: RssReaderSettings) => {
                this.settings = value;
            })
        );

        await this.loadSettings();

        this.addCommand({
            id: "rss-open",
            name: t("open"),
            checkCallback: (checking: boolean) => {
                if (checking) {
                    return (this.app.workspace.getLeavesOfType(VIEW_ID).length === 0);
                }
                this.initLeaf();
            }
        });

        /* parser not fully implemented
        this.addCommand({
            id: "rss-import",
            name: "Import OPML",
            callback: () => {
                new ImportModal(this.app, this).open();
            }
        });*/

        this.addCommand({
            id: 'rss-refresh',
            name: t("refresh_feeds"),
            callback: async () => {
                await this.updateFeeds();
            }
        });

        this.registerView(VIEW_ID, (leaf: WorkspaceLeaf) => new ViewLoader(leaf, this));

        this.addSettingTab(new RSSReaderSettingsTab(this.app, this));

        let interval: number;
        if (this.settings.updateTime !== 0) {
            interval = window.setInterval(async () => {
                await this.updateFeeds();
            }, this.settings.updateTime * 60 * 1000);
            this.registerInterval(interval);
        }

        if (this.settings.autoSync) {
            this.registerInterval(window.setInterval(async () => {
                await this.loadSettings();
            }, 1000 * 60));
        }

        //reset update timer on settings change.
        settingsStore.subscribe((settings: RssReaderSettings) => {
            if (interval !== undefined)
                clearInterval(interval);
            if (settings.updateTime != 0) {
                interval = window.setInterval(async () => {
                    await this.updateFeeds();
                }, settings.updateTime * 60 * 1000);
                this.registerInterval(interval);
            }

            this.settings = settings;
            this.saveSettings();
        });

        feedsStore.subscribe((feeds: RssFeedContent[]) => {
            //keep sorted store sorted when the items change.
            const sorted = groupBy(feeds, "folder");
            sortedFeedsStore.update(() => sorted);

            let items: RssFeedItem[] = [];
            for (const feed in Object.keys(feeds)) {
                //@ts-ignore
                const feedItems = feeds[feed].items;
                items = items.concat(feedItems);
            }

            //collect all tags for auto completion
            const tags: string[] = [];
            for (let item of items) {
                tags.push(...item.tags);
            }
            //@ts-ignore
            const fileTags = this.app.metadataCache.getTags();
            for(const tag of Object.keys(fileTags)) {
                tags.push(tag.replace('#', ''));
            }
            tagsStore.update(() => new Set<string>(tags.filter(tag => tag.length > 0)));

            this.filterItems(items);
        });

        this.app.workspace.onLayoutReady(async () => {
            await this.updateFeeds();
            await this.migrateData();
            await this.initLeaf();
        });
    }

    filterItems(items: RssFeedItem[]): void {
        const filtered = new Array<FilteredFolderContent>();
        for (const filter of this.settings.filtered) {
            // @ts-ignore
            const filterType = FilterType[filter.filterType];
            // @ts-ignore
            const sortOrder = SortOrder[filter.sortOrder];
            let filteredItems: RssFeedItem[];
            if (filterType == FilterType.READ) {
                filteredItems = items.filter((item) => {
                    return item.read && (filter.filterContent.split(",").contains(item.folder) || filter.filterContent.length == 0);
                });
            }
            if (filterType == FilterType.FAVORITES) {
                filteredItems = items.filter((item) => {
                    return item.favorite && (filter.filterContent.split(",").contains(item.folder) || filter.filterContent.length == 0);
                });
            }
            if (filterType == FilterType.UNREAD) {
                filteredItems = items.filter((item) => {
                    return !item.read && (filter.filterContent.split(",").contains(item.folder) || filter.filterContent.length == 0);
                });
            }
            if (filterType == FilterType.TAGS) {
                filteredItems = items.filter((item) => {
                    return item.tags.some((tag) => filter.filterContent.split(",").contains(tag));
                });
            }
            const sortedItems = this.sortItems(filteredItems, sortOrder);
            filtered.push({filter: filter, items: {items: sortedItems}});
        }
        filteredItemsStore.update(() => filtered);
    }

    sortItems(items: RssFeedItem[], sortOrder: SortOrder): RssFeedItem[] {
        if (sortOrder === SortOrder.ALPHABET_NORMAL) {
            return items.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sortOrder === SortOrder.ALPHABET_INVERTED) {
            return items.sort((a, b) => b.title.localeCompare(a.title))
        }
        if (sortOrder === SortOrder.DATE_NEWEST) {
            //@ts-ignore
            return items.sort((a, b) => window.moment(b.pubDate) - window.moment(a.pubDate));
        }
        if (sortOrder === SortOrder.DATE_OLDEST) {
            //@ts-ignore
            return items.sort((a, b) => window.moment(a.pubDate) - window.moment(b.pubDate));
        }
        return items;
    }

    async updateFeeds(): Promise<void> {
        interface IStringTMap<T> {
            [key: string]: T;
        }

        type IIdentified = {
            hash: string;
        };

        function mergeArrayById<T extends IIdentified>(
            array1: T[],
            array2: T[]
        ): T[] {
            const mergedObjectMap: IStringTMap<T> = keyBy(array1, 'hash');

            const finalArray: T[] = [];

            for (const object of array2) {
                mergedObjectMap[object.hash] = {
                    ...mergedObjectMap[object.hash],
                    ...object,
                };
            }

            values(mergedObjectMap).forEach(object => {
                finalArray.push(object);
            });
            return finalArray;
        }

        function customizer(objValue: string | any[], srcValue: any) {
            if (Array.isArray(objValue)) {
                return mergeArrayById(objValue, srcValue);
            }
        }

        let result: RssFeedContent[] = [];
        for (const feed of this.settings.feeds) {
            const items = await getFeedItems(feed);
            result.push(items);
        }
        let items = this.settings.items;
        for (const feed of items) {
            for (let item of feed.items) {
                if(item.hash === undefined) {
                    item.hash = <string>new Md5().appendStr(item.title).appendStr(item.folder).appendStr(item.link).end();
                }
            }
        }

        result = mergeWith(result, items, customizer);
        await this.writeFeedContent(() => result);
    }

    onunload(): void {
        console.log('unloading plugin rss reader');
        this.app.workspace
            .getLeavesOfType(VIEW_ID)
            .forEach((leaf) => leaf.detach());
    }

    async initLeaf(): Promise<void> {
        if (this.app.workspace.getLeavesOfType(VIEW_ID).length > 0) {
            return;
        }
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_ID,
        });
    }

    //migrate from old settings pre 0.6.0
    async migrateData(): Promise<void> {
        const configPath = this.app.vault.configDir + "/plugins/rss-reader/data.json";
        const config = JSON.parse(await this.app.vault.adapter.read(configPath));

        if (config.read === undefined) return;

        new Notice("RSS Reader: migrating data");

        for (const content of Object.values(config.items)) {
            // @ts-ignore
            for (const item of content.items) {
                if (config.read.items.some((readItem: RssFeedItem) => {
                    return item.title == readItem.title && item.link == readItem.link && item.content == readItem.content
                })) {
                    item.read = true;
                }
            }
            // @ts-ignore
            for (const item of content.items) {
                if (config.favorites.items.some((favItem: RssFeedItem) => {
                    return item.title == favItem.title && item.link == favItem.link && item.content == favItem.content
                })) {
                    item.favorite = true;
                }
            }
        }
        delete config.read;
        delete config.favorites;

        await this.app.vault.adapter.write(configPath, JSON.stringify(config));
        await this.loadSettings();

        new Notice("RSS Reader: data has been migrated");

    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        settingsStore.set(this.settings);
        configuredFeedsStore.set(this.settings.feeds);
        feedsStore.set(this.settings.items);
        foldedState.set(this.settings.folded);
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    async writeFeeds(changeOpts: (feeds: RssFeed[]) => Partial<RssFeed[]>): Promise<void> {
        await configuredFeedsStore.update((old) => ({...old, ...changeOpts(old)}));
        await this.writeSettings((old) => ({
            feeds: changeOpts(old.feeds)
        }));
        await this.updateFeeds();
    }

    async writeFeedContent(changeOpts: (items: RssFeedContent[]) => Partial<RssFeedContent[]>): Promise<void> {
        await feedsStore.update((old) => ({...changeOpts(old)}));
        await this.writeSettings((old) => ({
            items: changeOpts(old.items)
        }));
    }

    async writeFiltered(changeOpts: (folders: FilteredFolder[]) => Partial<FilteredFolder[]>): Promise<void> {
        await filteredStore.update((old) => ({...old, ...changeOpts(old)}));
        await this.writeSettings((old) => ({
            filtered: changeOpts(old.filtered)
        }));
        await this.updateFeeds();
    }

    async writeFolded(folded: string[]): Promise<void> {
        await foldedState.update(() => (folded));
        await this.writeSettings(() => ({
            folded: folded
        }));
    }

    async writeSettings(changeOpts: (settings: RssReaderSettings) => Partial<RssReaderSettings>): Promise<void> {
        await settingsStore.update((old) => ({...old, ...changeOpts(old)}));
    }
}
