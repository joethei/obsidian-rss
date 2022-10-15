import {ButtonComponent, ItemView, setIcon, WorkspaceLeaf} from "obsidian";
import RssReaderPlugin from "../main";
import {VIEW_ID} from "../consts";
import t from "../l10n/locale";
import {ItemModal} from "../modals/ItemModal";

export default class ViewLoader extends ItemView {
    private readonly plugin: RssReaderPlugin;

    private headerButtons: HTMLDivElement;
    private contentContainer: HTMLDivElement;

    constructor(leaf: WorkspaceLeaf, plugin: RssReaderPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.headerButtons = this.contentEl.createDiv('header_buttons');
        this.contentEl.createEl('hr');
        this.contentContainer = this.contentEl.createDiv('content_container');
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

        new ButtonComponent(this.headerButtons)
            .setIcon('refresh-cw')
            .setTooltip(t('refresh_feeds'))
            .onClick(async() => {
                await this.displayData();
            });

        await this.displayData();
    }

    private async displayData() {

        this.contentContainer.empty();

        const folders = await this.plugin.providers.getCurrent().folders();

        for (let folder of folders) {
            const folderDiv = this.contentContainer.createDiv('rss-folder');
            const folderCollapseIcon = folderDiv.createSpan();
            setIcon(folderCollapseIcon, 'right-triangle');
            folderDiv.createSpan({text: folder.name()});

            for (let feed of folder.feeds()) {
                const feedDiv = folderDiv.createDiv('feed');
                const feedTitleDiv = feedDiv.createSpan('rss-feed');

                const feedCollapse = feedTitleDiv.createSpan();
                setIcon(feedCollapse, 'right-triangle');

                if(feed.favicon()) {
                    feedTitleDiv.createEl('img', {cls: 'feed-favicon', attr: {src: feed.favicon()}});

                }
                feedTitleDiv.createSpan( {text: feed.title()});

                const feedList = feedDiv.createEl('ul');

                for (let item of feed.items()) {
                    const itemDiv = feedList.createEl('li');

                    if(item.starred())
                        setIcon(itemDiv.createSpan(), 'star');
                    if(item.created())
                        setIcon(itemDiv.createSpan(), 'document');

                    if(item.read())
                        itemDiv.addClass('rss-read');

                    itemDiv.createSpan({text: item.title()});

                    itemDiv.onClickEvent(() => {
                        new ItemModal(this.plugin, item, null, true).open();
                    });
                }
            }
        }
    }
}
