import {ItemView, WorkspaceLeaf} from "obsidian";
import ListFeedsView from "./ListFeedsView.svelte";
import RssReaderPlugin from "./main";
import {RssReaderSettings} from "./settings";
import {settingsWrit} from "./stores";

export default class ListFeedsViewLoader extends ItemView {
    private feed: ListFeedsView;
    private plugin: RssReaderPlugin;
    private settings: RssReaderSettings;

    constructor(leaf: WorkspaceLeaf, plugin: RssReaderPlugin) {
        super(leaf);
        this.plugin = plugin;

        this.settings = null;
        settingsWrit.subscribe((value) => {
            this.settings = value;

            // Refresh if settings change
            if (this.feed) {
                console.log("settings have been updated");
            }
        });
    }

    getDisplayText(): string {
        return "RSS Feed";
    }

    getViewType(): string {
        return "RSS_FEED";
    }

    getIcon(): string {
        return "rss-feed";
    }

    protected async onOpen(): Promise<void> {
        this.feed = new ListFeedsView({
            target: (this as any).contentEl,
            props: {
                feeds: this.plugin.settings.feeds,
                app: this.plugin.app,
            },

        });
    }

    protected onClose(): Promise<void> {
        if(this.feed) {
            this.feed.$destroy();
        }
        return Promise.resolve();
    }
}
