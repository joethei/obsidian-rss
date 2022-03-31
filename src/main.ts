import {Notice, Plugin, WorkspaceLeaf} from 'obsidian';
import {DEFAULT_SETTINGS, RssFeed, RssReaderSettings} from "./settings/settings";
import ViewLoader from "./view/ViewLoader";
import {
    configuredFeedsStore,
    feedsStore,
    FilteredFolderContent,
    filteredItemsStore,
    filteredStore,
    foldedState,
    folderStore,
    settingsStore,
    sortedFeedsStore,
    tagsStore
} from "./stores";
import {VIEW_ID} from "./consts";
import {getFeedItems, RssFeedContent, RssFeedItem} from "./parser/rssParser";
import groupBy from "lodash.groupby";
import mergeWith from "lodash.mergewith";
import keyBy from "lodash.keyby";
import values from "lodash.values";
import {FilteredFolder, SortOrder} from "./modals/FilteredFolderModal";
import {Md5} from "ts-md5";
import t from "./l10n/locale";
import {RSSReaderSettingsTab} from "./settings/SettingsTab";
import {CleanupModal} from "./modals/CleanupModal";
import {TextInputPrompt} from "./modals/TextInputPrompt";
import {ArticleSuggestModal} from "./modals/ArticleSuggestModal";


export default class RssReaderPlugin extends Plugin {
    settings: RssReaderSettings;

    async onload(): Promise<void> {
        console.log('loading plugin rss reader');

        //update settings object whenever store contents change.
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


        this.addCommand({
            id: 'rss-refresh',
            name: t("refresh_feeds"),
            callback: async () => {
                await this.updateFeeds();
            }
        });

        this.addCommand({
            id: 'rss-cleanup',
            name: t("cleanup"),
            callback: async () => {
                new CleanupModal(this).open();
            }
        });

        this.addCommand({
            id: 'rss-open-feed',
            name: "Open Feed from URL",
            callback: async () => {
                const input = new TextInputPrompt(this.app, "URL", "URL", "", "", t("open"));
                await input.openAndGetValue(async (text) => {
                    const items = await getFeedItems({name: "", folder: "", url: text.getValue()});
                    if (!items || items.items.length === 0) {
                        input.setValidationError(text, t("invalid_feed"));
                        return;
                    }

                    input.close();
                    new ArticleSuggestModal(this, items.items).open();
                });
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

        this.app.workspace.onLayoutReady(async () => {
            await this.migrateData();
            await this.initLeaf();
            await this.updateFeeds();


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
                for (const item of items) {
                    if (item !== undefined)
                        tags.push(...item.tags);
                }

                //@ts-ignore
                const fileTags = this.app.metadataCache.getTags();
                for (const tag of Object.keys(fileTags)) {
                    tags.push(tag.replace('#', ''));
                }
                tagsStore.update(() => new Set<string>(tags.filter(tag => tag.length > 0)));

                //collect all folders for auto-completion
                const folders: string[] = [];
                for (const item of items) {
                    if (item !== undefined)
                        folders.push(item.folder);
                }
                folderStore.update(() => new Set<string>(folders.filter(folder => folder !== undefined && folder.length > 0)));

                this.filterItems(items);
            });
        });
    }

    filterItems(items: RssFeedItem[]): void {
        const filtered = new Array<FilteredFolderContent>();
        for (const filter of this.settings.filtered) {
            // @ts-ignore
            const sortOrder = SortOrder[filter.sortOrder];
            let filteredItems: RssFeedItem[];

            if (filter.read && filter.unread) {
                filteredItems = items.filter((item) => {
                    return item.read === filter.read || item.read !== filter.unread;
                });
            } else if (filter.read) {
                filteredItems = items.filter((item) => {
                    return item.read;
                });
            } else if (filter.unread) {
                filteredItems = items.filter((item) => {
                    return !item.read;
                });
            }


            if (filter.favorites) {
                filteredItems = filteredItems.filter((item) => {
                    return item.favorite === filter.favorites;
                });
            }

            if (filter.filterFolders.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    return filter.filterFolders.includes(item.folder);
                });
            }
            if (filter.ignoreFolders.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    return !filter.ignoreFolders.includes(item.folder);
                });
            }

            if (filter.filterFeeds.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    return filter.filterFeeds.includes(item.feed);
                });
            }
            if (filter.ignoreFeeds.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    return !filter.ignoreFeeds.includes(item.feed);
                });
            }

            if (filter.filterTags.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    for (const tag of filter.filterTags) {
                        if (!item.tags.contains(tag)) return false;
                    }
                    return true;
                });
            }
            if (filter.ignoreTags.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    for (const tag of filter.ignoreTags) {
                        if (item.tags.contains(tag)) return false;
                    }
                    return true;
                });
            }

            const sortedItems = this.sortItems(filteredItems, sortOrder);
            filtered.push({filter: filter, items: {items: sortedItems}});
        }
        filteredItemsStore.update(() => filtered);
    }

    sortItems(items: RssFeedItem[], sortOrder: SortOrder): RssFeedItem[] {
        if (!items) return items;
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
        console.log("updating feeds");
        interface IStringTMap<T> {
            [key: string]: T;
        }

        type IIdentified = {
            hash: string;
        };

        function mergeArrayById<T extends IIdentified>(array1: T[], array2: T[]): T[] {
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
            if (items)
                result.push(items);
        }

        const items = this.settings.items;
        for (const feed of items) {
            if (feed.hash === undefined || feed.hash === "") {
                feed.hash = <string>new Md5().appendStr(feed.name).appendStr(feed.folder ? feed.folder : "no-folder").end();
            }
            for (const item of feed.items) {
                if (item.folder !== feed.folder || item.feed !== feed.name) {
                    feed.items.remove(item);
                }
                if (item.hash === undefined) {
                    item.hash = <string>new Md5().appendStr(item.title).appendStr(item.folder).appendStr(item.link).end();
                }
            }
        }

        result = mergeWith(result, items, customizer);
        new Notice(t("refreshed_feeds"));
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

    async migrateData(): Promise<void> {
        const configPath = this.app.vault.configDir + "/plugins/rss-reader/data.json";
        const config = JSON.parse(await this.app.vault.adapter.read(configPath));

        for(const feed of config.feeds) {
            if(feed.folder === undefined) {
                feed.folder = "";
            }
        }
        for(const feed of config.items) {
            if(feed.folder === undefined) {
                feed.folder = "";
            }
        }
        await this.app.vault.adapter.write(configPath, JSON.stringify(config));

        if (config.filtered.length === 0) return;

        if (config.filtered[0].ignoreFolders === undefined) {
            new Notice("RSS Reader: migrating data");
            console.log("RSS Reader: adding ignored fields to filters");

            for (const filter of config.filtered) {
                filter.ignoreTags = [];
                filter.ignoreFolders = [];
                filter.ignoreFeeds = [];

            }
            await this.app.vault.adapter.write(configPath, JSON.stringify(config));
            await this.loadSettings();
            new Notice("RSS Reader: data has been migrated");
        }

        if (config.filtered[0].filterType === undefined) return;


        new Notice("RSS Reader: migrating data");

        for (const filter of config.filtered) {
            const newFilter: FilteredFolder = {
                filterFolders: [],
                filterTags: [],
                filterFeeds: [],
                favorites: false,
                read: false,
                unread: false,
                sortOrder: filter.sortOrder,
                name: filter.name,
                ignoreFolders: [],
                ignoreFeeds: [],
                ignoreTags: [],
            };

            if (filter.filterType === "FAVORITES") newFilter.favorites = true;
            if (filter.filterType === "READ") newFilter.read = true;
            if (filter.filterType === "UNREAD") newFilter.unread = true;
            if (filter.filterType === "TAGS") {
                if (filter.filterContent !== "") {
                    newFilter.filterTags = filter.filterContent.split(",");
                }
            } else {
                if (filter.filterContent !== "") {
                    newFilter.filterFolders = filter.filterContent.split(",");
                }
            }
            newFilter.read = true;
            newFilter.unread = true;
            config.filtered = config.filtered.filter((item: any) => item.name !== filter.name);
            config.filtered.push(newFilter);
        }

        await this.app.vault.adapter.write(configPath, JSON.stringify(config));
        await this.loadSettings();

        new Notice("RSS Reader: data has been migrated");


        //migrate from old settings pre 0.6.0
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
        const configPath = this.app.vault.configDir + "/plugins/rss-reader/data.json";
        let file: string;
        try {
            file = await this.app.vault.adapter.read(configPath);
        } catch (e) {
            console.error(e);
        }

        if (file !== undefined) {
            try {
                JSON.parse(file);
            } catch (e) {
                console.log(t("RSS_Reader") + "  could not parse json, check if the plugins data.json is valid.");
                console.error(e);
                new Notice(t("RSS_Reader") + " could not parse plugin data. If this message keeps showing up, check the console");
                return Promise.resolve();
            }
        }

        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
        if (data !== undefined && data !== null) {
            this.settings.hotkeys = Object.assign({}, DEFAULT_SETTINGS.hotkeys, data.hotkeys);
        }
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
