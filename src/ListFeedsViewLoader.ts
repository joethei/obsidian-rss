import {ItemView, WorkspaceLeaf} from "obsidian";
import ListFeedsView from "./ListFeedsView.svelte";
import RssReaderPlugin from "./main";
import {VIEW_ID} from "./consts";

export default class ListFeedsViewLoader extends ItemView {
    private feed: ListFeedsView;
    private readonly plugin: RssReaderPlugin;


    constructor(leaf: WorkspaceLeaf, plugin: RssReaderPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.addAction('feather-eye', 'only show unread', () => {

        }, 6);
    }

    getDisplayText(): string {
        return "RSS Feed";
    }

    getViewType(): string {
        return VIEW_ID;
    }

    getIcon(): string {
        return "feather-rss";
    }

    protected async onOpen(): Promise<void> {
        this.feed = new ListFeedsView({
            target: (this as any).contentEl,
            props: {
                plugin: this.plugin
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
