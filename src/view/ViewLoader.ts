import {ItemView, WorkspaceLeaf} from "obsidian";
import FolderView from "./FolderView.svelte";
import RssReaderPlugin from "../main";
import {VIEW_ID} from "../consts";
import t from "../l10n/locale";

export default class ViewLoader extends ItemView {
    private feed: FolderView;
    private readonly plugin: RssReaderPlugin;


    constructor(leaf: WorkspaceLeaf, plugin: RssReaderPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getDisplayText(): string {
        return t("RSS_Feeds");
    }

    getViewType(): string {
        return VIEW_ID;
    }

    getIcon(): string {
        return "rss";
    }

    protected async onOpen(): Promise<void> {
        this.feed = new FolderView({
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
