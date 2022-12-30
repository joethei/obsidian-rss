import {setIcon, View, WorkspaceLeaf} from "obsidian";
import RssReaderPlugin from "../main";
import {VIEW_ID} from "../consts";
import t from "../l10n/locale";
import {ItemModal} from "../modals/ItemModal";

export default class ViewLoader extends View {
    private readonly plugin: RssReaderPlugin;

    private navigationEl: HTMLElement;
    private navigationButtonsEl: HTMLElement;
    private contentContainer: HTMLDivElement;

    constructor(leaf: WorkspaceLeaf, plugin: RssReaderPlugin) {
        super(leaf);
        this.plugin = plugin;

        this.navigationEl = this.containerEl.createDiv('nav-header');
        this.navigationButtonsEl = this.navigationEl.createDiv('nav-buttons-container');

        this.contentContainer = this.containerEl.createDiv({cls: 'content rss-scrollable-content'});
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
        const buttonEl = this.navigationButtonsEl.createDiv('clickable-buttons nav-action-button');
        buttonEl.addEventListener('click', async() => {
           await this.displayData();
        });
        setIcon(buttonEl,'refresh-cw');
        buttonEl.setAttr('aria-label', t('refresh_feeds'));

        await this.displayData();
    }

    private async displayData() {

        this.contentContainer.empty();

        const folders = await this.plugin.providers.getCurrent().folders();

        for (const folder of folders) {
            const folderDiv = this.contentContainer.createDiv('rss-folder');
            const folderCollapseIcon = folderDiv.createSpan();
            setIcon(folderCollapseIcon, 'right-triangle');
            folderDiv.createSpan({text: folder.name()});

            for (const feed of folder.feeds()) {
                const feedDiv = folderDiv.createDiv('feed');
                const feedTitleDiv = feedDiv.createSpan('rss-feed');

                const feedCollapse = feedTitleDiv.createSpan();
                setIcon(feedCollapse, 'right-triangle');

                if(feed.favicon()) {
                    feedTitleDiv.createEl('img', {cls: 'feed-favicon', attr: {src: feed.favicon()}});

                }
                feedTitleDiv.createSpan({text: feed.title()});

                const feedList = feedDiv.createEl('ul');

                for (const item of feed.items()) {
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
