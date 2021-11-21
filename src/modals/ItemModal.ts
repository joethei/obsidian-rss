import {
    ButtonComponent,
    Modal,
} from "obsidian";
import {RssFeedItem} from "../parser/rssParser";
import RssReaderPlugin from "../main";
import {sanitizeHTMLToDom} from "../consts";
import Action from "../actions/Action";

export class ItemModal extends Modal {

    private readonly plugin: RssReaderPlugin;
    private readonly item: RssFeedItem;

    private readButton: ButtonComponent;
    private favoriteButton: ButtonComponent;

    constructor(plugin: RssReaderPlugin, item: RssFeedItem) {
        super(plugin.app);
        this.plugin = plugin;
        this.item = item;
        item.read = true;

        const items = this.plugin.settings.items;
        this.plugin.writeFeedContent(() => {
            return items;
        });

        this.scope.register([], this.plugin.settings.hotkeys.read, () => {
            this.markAsRead();
        });
        this.scope.register([], this.plugin.settings.hotkeys.favorite, () => {
            this.markAsFavorite();
        });
        this.scope.register([], this.plugin.settings.hotkeys.create, () => {
            Action.CREATE_NOTE.processor(this.plugin, this.item);
        });
        this.scope.register([], this.plugin.settings.hotkeys.paste, () => {
            Action.PASTE.processor(this.plugin, this.item);
        });
        this.scope.register([], this.plugin.settings.hotkeys.copy, () => {
            Action.COPY.processor(this.plugin, this.item);
        });
        this.scope.register([], this.plugin.settings.hotkeys.tags, () => {
            Action.TAGS.processor(this.plugin, this.item);
        });
        this.scope.register([], this.plugin.settings.hotkeys.open, () => {
            Action.OPEN.processor(this.plugin, this.item);
        });
    }

    async markAsFavorite() : Promise<void> {
        await Action.FAVORITE.processor(this.plugin, this.item);
        this.favoriteButton.setIcon((this.item.favorite) ? 'star-glyph' : 'star');
    }

    async markAsRead() : Promise<void> {
        await Action.READ.processor(this.plugin, this.item);
        this.readButton.setIcon((this.item.read) ? 'feather-eye-off' : 'feather-eye');
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

        this.readButton = new ButtonComponent(topButtons)
            .setIcon(this.item.read ? 'feather-eye-off' : 'feather-eye')
            .setTooltip(this.item.read ? 'Mark as unread' : 'mark as read')
            .onClick(async () => {
                await this.markAsRead();
            });
        this.readButton.buttonEl.setAttribute("tabindex", "-1");

        this.favoriteButton = new ButtonComponent(topButtons)
            .setIcon(this.item.favorite ? 'star-glyph' : 'star')
            .setTooltip(this.item.favorite ? 'remove from favorites' : 'mark as favorite')
            .onClick(async () => {
               await this.markAsFavorite();
            });
        this.favoriteButton.buttonEl.setAttribute("tabindex", "-1");

        Array.of(Action.TAGS, Action.CREATE_NOTE, Action.PASTE, Action.COPY, Action.OPEN).forEach((action) => {
            const button = new ButtonComponent(topButtons)
                .setIcon(action.icon)
                .setTooltip(action.name)
                .onClick(async () => {
                    await action.processor(this.plugin, this.item);
                });
            button.buttonEl.setAttribute("tabindex", "-1");
        });
        /*//@ts-ignore
        if(this.app.plugins.plugins["obsidian-tts"]) {
            new ButtonComponent(topButtons)
                .setIcon("audio-file")
                .setTooltip("Read article")
                .onClick(async () => {
                    //@ts-ignore
                   await this.app.plugins.plugins["obsidian-tts"].playText(this.item.content);
                });
        }*/

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
