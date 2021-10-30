import {
    ButtonComponent,
    htmlToMarkdown,
    Modal,
    Notice,
} from "obsidian";
import {RssFeedItem} from "../parser/rssParser";
import {favoritesStore, FeedItems, readStore} from "../stores";
import RssReaderPlugin from "../main";
import {get} from "svelte/store";
import {copy} from "obsidian-community-lib";
import {sanitizeHTMLToDom} from "../consts";
import {createNewNote, openInBrowser, pasteToNote} from "../functions";

export class ItemModal extends Modal {

    private readonly plugin: RssReaderPlugin;
    private readonly item: RssFeedItem;
    private readItems: FeedItems;
    private favoriteItems: FeedItems;

    constructor(plugin: RssReaderPlugin, item: RssFeedItem) {
        super(plugin.app);
        this.plugin = plugin;
        this.item = item;
        const read = get(readStore);
        if(!read.items.some(item => item.link === this.item.link)) {
            read.items.push(this.item);
            this.plugin.writeRead(() => (read));
        }
        readStore.subscribe((value: FeedItems) => {
            this.readItems = value;
        });
        favoritesStore.subscribe((value: FeedItems) => {
            this.favoriteItems = value;
        });
    }

    onOpen() : void {
        const {contentEl} = this;

        const topButtons = contentEl.createSpan('topButtons');

        const title = contentEl.createEl('h1', 'title');
        title.setText(this.item.title);

        const subtitle = contentEl.createEl("h3", "subtitle");
        if (this.item.creator) {
            subtitle.appendText(this.item.creator);
        }
        if (this.item.pubDate) {
            subtitle.appendText(" - " + this.item.pubDate);
        }

        let hasBeenRead = this.readItems.items.some(item => item.link === this.item.link)

        const readButton = new ButtonComponent(topButtons)
            .setIcon(hasBeenRead ? 'feather-eye-off' : 'feather-eye')
            .setTooltip(hasBeenRead ? 'Mark as unread' : 'mark as read')
            .onClick(async () => {
                if (hasBeenRead) {
                    this.readItems.items
                        .filter((item => item.link === this.item.link))
                        .forEach(item => {
                            this.readItems.items.remove(item);
                        });
                    this.readItems.items.remove(this.item);
                    readButton.setIcon('feather-eye');
                    hasBeenRead = false;
                    new Notice("marked item as unread");
                } else {
                    this.readItems.items.push(this.item);
                    readButton.setIcon('feather-eye-off');
                    hasBeenRead = true;
                    new Notice("marked item as read");
                }
                await this.plugin.writeRead(() => (this.readItems));
            });

        let isFavorite = this.favoriteItems.items.some(item => item.link === this.item.link);

        const favoriteButton = new ButtonComponent(topButtons)
            .setIcon(isFavorite ? 'star-glyph' : 'star')
            .setTooltip(isFavorite ? 'remove from favorites' : 'mark as favorite')
            .onClick(async () => {
                if (isFavorite) {
                    this.favoriteItems.items.
                        filter(item => item.link === this.item.link)
                        .forEach(item => {
                            this.favoriteItems.items.remove(item);
                        });
                    favoriteButton.setIcon('star');
                    isFavorite = false;
                    new Notice("removed item from favorites");
                } else {
                    this.favoriteItems.items.push(this.item);
                    favoriteButton.setIcon('star-glyph');
                    isFavorite = true;
                    new Notice("added item to favorites");
                }
                await this.plugin.writeFavorites(() => (this.favoriteItems));
            });

        new ButtonComponent(topButtons).setTooltip("open in browser").setIcon("open-elsewhere-glyph").onClick(() => {
           openInBrowser(this.item);
        });

        new ButtonComponent(topButtons).setTooltip("Add as new note").setIcon("create-new").onClick(async () => {
            await createNewNote(this.plugin, this.item);
        });

        new ButtonComponent(topButtons).setTooltip("paste to current note").setIcon("paste").onClick(async() => {
            await pasteToNote(this.plugin, this.item);
        });

        new ButtonComponent(topButtons).setTooltip("copy content to clipboard").setIcon("feather-clipboard").onClick(async () => {
            await copy(htmlToMarkdown(this.item.content));
        });

        const content = contentEl.createDiv('content');
        if (this.item.content) {
            content.append(sanitizeHTMLToDom(this.item.content));
        }
    }

    onClose() : void {
        const {contentEl} = this;
        contentEl.empty();
    }
}
