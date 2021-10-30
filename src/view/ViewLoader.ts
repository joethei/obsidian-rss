import {ItemView, WorkspaceLeaf} from "obsidian";
import ListFeedsView from "./FolderView.svelte";
import RssReaderPlugin from "../main";
import {VIEW_ID} from "../consts";

export default class ViewLoader extends ItemView {
    private feed: ListFeedsView;
    private readonly plugin: RssReaderPlugin;


    constructor(leaf: WorkspaceLeaf, plugin: RssReaderPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getDisplayText(): string {
        return "RSS Feeds";
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
