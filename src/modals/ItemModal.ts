import {
    ButtonComponent,
    Modal,
    Notice,
} from "obsidian";
import {RssFeedItem} from "../parser/rssParser";
import RssReaderPlugin from "../main";
import {sanitizeHTMLToDom} from "../consts";
import Action from "../actions/Action";

export class ItemModal extends Modal {

    private readonly plugin: RssReaderPlugin;
    private readonly item: RssFeedItem;

    constructor(plugin: RssReaderPlugin, item: RssFeedItem) {
        super(plugin.app);
        this.plugin = plugin;
        this.item = item;
        item.read = true;

        const items = this.plugin.settings.items;
        this.plugin.writeFeedContent(() => {
            return items;
        });
    }

    display(): void {
        const {contentEl} = this;
        contentEl.empty();

        const topButtons = contentEl.createSpan('topButtons');

        const title = contentEl.createEl('h1', 'rss-title');
        title.setText(this.item.title);

        const subtitle = contentEl.createEl("h3", "rss-subtitle");
        if (this.item.creator) {
            subtitle.appendText(this.item.creator);
        }
        if (this.item.pubDate) {
            subtitle.appendText(" - " + window.moment(this.item.pubDate).format(this.plugin.settings.dateFormat));
        }
        const tagEl = contentEl.createSpan("tags");
        this.item.tags.forEach((tag) => {
            const tagA = tagEl.createEl("a");
            tagA.setText(tag);
            tagA.addClass("tag", "rss-tag");
        });

        const readButton = new ButtonComponent(topButtons)
            .setIcon(this.item.read ? 'feather-eye-off' : 'feather-eye')
            .setTooltip(this.item.read ? 'Mark as unread' : 'mark as read')
            .onClick(async () => {
                if (this.item.read) {
                    readButton.setIcon('feather-eye');
                    this.item.read = false;
                    new Notice("marked item as unread");
                } else {
                    this.item.read = true;
                    readButton.setIcon('feather-eye-off');
                    new Notice("marked item as read");
                }
                const items = this.plugin.settings.items;
                await this.plugin.writeFeedContent(() => {
                    return items;
                });
            });

        const favoriteButton = new ButtonComponent(topButtons)
            .setIcon(this.item.favorite ? 'star-glyph' : 'star')
            .setTooltip(this.item.favorite ? 'remove from favorites' : 'mark as favorite')
            .onClick(async () => {
                if (this.item.favorite) {
                    favoriteButton.setIcon('star');
                    this.item.favorite = false;
                    new Notice("removed item from favorites");
                } else {
                    favoriteButton.setIcon('star-glyph');
                    this.item.favorite = true;
                    new Notice("added item to favorites");
                }
                const items = this.plugin.settings.items;
                await this.plugin.writeFeedContent(() => {
                    return items;
                });

            });

        Action.actions.forEach((action) => {
            new ButtonComponent(topButtons)
                .setIcon(action.icon)
                .setTooltip(action.name)
                .onClick(async () => {
                    await action.processor(this.plugin, this.item);
                });
        });

        const content = contentEl.createDiv('rss-content');
        content.addClass("scrollable-content");
        if (this.item.content) {
            content.append(sanitizeHTMLToDom(this.item.content));
        }
    }

    onClose(): void {
        const {contentEl} = this;
        contentEl.empty();
    }

    async onOpen(): Promise<void> {
        await this.display();
    }
}
