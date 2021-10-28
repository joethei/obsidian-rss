import {Plugin, WorkspaceLeaf} from 'obsidian';
import {DEFAULT_SETTINGS, RssFeed, RssReaderSettings, RSSReaderSettingsTab} from "./settings";
import ListFeedsViewLoader from "./ListFeedsViewLoader";
import {
	favoritesStore,
	configuredFeedsStore,
	readStore,
	settingsStore,
	feedsStore,
	sortedFeedsStore,
	FeedItems
} from "./stores";
import {ImportModal} from "./importModal";
import {VIEW_ID} from "./consts";
import {getFeedItems, RssFeedMap} from "./rssParser";
import {addFeatherIcon} from "obsidian-community-lib";
import groupBy from "lodash.groupby";

export default class RssReaderPlugin extends Plugin {
	settings: RssReaderSettings;
	private view: ListFeedsViewLoader;

	async onload() {
		console.log('loading plugin rss reader');

		addFeatherIcon("rss");
		addFeatherIcon("eye");
		addFeatherIcon("eye-off");
		addFeatherIcon("star");
		addFeatherIcon("clipboard");

		this.register(
			settingsStore.subscribe((value: RssReaderSettings) => {
				console.log("updated settings");
				this.settings = value;
			})
		);

		await this.loadSettings();

		this.addCommand({
			id: "rss-reveal",
			name: "Open Feed",
			checkCallback: (checking: boolean) => {
				if(checking) {
					return (this.app.workspace.getLeavesOfType(VIEW_ID).length === 0);
				}
				this.initLeaf();
			}
		});

		this.addCommand({
			id: "rss-import",
			name: "Import OPML",
			callback: () => {
				new ImportModal(this.app, this).open();
			}
		});

		this.registerView(VIEW_ID, (leaf: WorkspaceLeaf) => (this.view = new ListFeedsViewLoader(leaf, this)));

		this.addSettingTab(new RSSReaderSettingsTab(this.app, this));

		await this.updateFeeds();

		this.registerInterval(window.setInterval(async() => {
			await this.updateFeeds();
		}, 1000 * 60 * 10));

		feedsStore.subscribe((feeds: RssFeedMap[]) => {
			const sorted = groupBy(feeds, "feed.folder");
			console.log(sorted);
			sortedFeedsStore.update(() => sorted);
		});

		if(this.app.workspace.layoutReady) {
			await this.initLeaf();
		} else {
			this.registerEvent(this.app.workspace.on("layout-change", this.initLeaf.bind(this)));
		}

	}

	async updateFeeds() {
		const result: RssFeedMap[] = [];
		for (const feed of this.settings.feeds) {
			const items = await getFeedItems(feed);
			result.push({feed: feed, content: items});
		}
		feedsStore.update(() => result);
	}

	onunload() {
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

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		settingsStore.update((old) => {
			return {
				...old,
				...(this.settings || []),
			};
		});
		configuredFeedsStore.update((old) => {
			return {
				...old,
				...(this.settings.feeds || []),
			};
		});
		favoritesStore.update((old) => {
			return {
				...old,
				...(this.settings.favorites || []),
			};
		});
		readStore.update((old) => {
			return {
				...old,
				...(this.settings.read || []),
			};
		});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async writeFeeds(changeOpts: (feeds: RssFeed[]) => Partial<RssFeed[]>) : Promise<void> {
		await configuredFeedsStore.update((old) => ({...old, ...changeOpts(old)}));
		await this.writeSettings((old) => ({
			feeds: changeOpts(old.feeds)
		}));
		await this.updateFeeds();
	}

	async writeFavorites(changeOpts: (items: FeedItems) => Partial<FeedItems>) : Promise<void> {
		favoritesStore.update((old) => ({...old, ...changeOpts(old)}));
		await this.writeSettings((old) => ({
			favorites: changeOpts(old.favorites)
		}));
	}

	async writeRead(changeOpts: (items: FeedItems) => Partial<FeedItems>) : Promise<void> {
		readStore.update((old) => ({...old, ...changeOpts(old)}));
		await this.writeSettings((old) => ({
			read: changeOpts(old.read)
		}));
	}

	async writeSettings(changeOpts: (settings: RssReaderSettings) => Partial<RssReaderSettings>): Promise<void> {
		await settingsStore.update((old) => ({ ...old, ...changeOpts(old) }));
		await this.saveSettings();
	}
}
