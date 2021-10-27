import {
    ButtonComponent,
    htmlToMarkdown,
    MarkdownView,
    Modal,
    normalizePath,
    Notice,
} from "obsidian";
import {RssFeedItem} from "./rssParser";
import {favoritesStore, FeedItems, readStore} from "./stores";
import RssReaderPlugin from "./main";
import {get} from "svelte/store";
import {copy, isInVault} from "obsidian-community-lib";
import {sanitizeHTMLToDom} from "./consts";

export class FeedItemModal extends Modal {

    private readonly plugin: RssReaderPlugin;
    private readonly item: RssFeedItem;
    private readItems: FeedItems;
    private favoriteItems: FeedItems;

    constructor(plugin: RssReaderPlugin, item: RssFeedItem) {
        super(plugin.app);
        this.plugin = plugin;
        this.item = item;
        const read = get(readStore);
        if(!read.items.some(item => item.title === this.item.title)) {
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

    onOpen() {
        let {contentEl} = this;

        let topButtons = contentEl.createDiv('topButtons');

        let title = contentEl.createEl('h1', 'title');
        title.setText(this.item.title);

        let subtitle = contentEl.createEl("h3", "subtitle");
        if (this.item.creator) {
            subtitle.appendText(this.item.creator);
        }
        if (this.item.pubDate) {
            subtitle.appendText(" - " + this.item.pubDate);
        }
        const readButton = new ButtonComponent(topButtons)
            .setIcon(this.readItems.items.some(item => item.title === this.item.title) ? 'feather-eye-off' : 'feather-eye')
            .setTooltip(this.readItems.items.some(item => item.title === this.item.title) ? 'Mark as unread' : 'mark as read')
            .onClick(async () => {
                if (this.readItems.items.some(item => item.title === this.item.title)) {
                    this.readItems.items.remove(this.item);
                    readButton.setIcon('feather-eye');
                    new Notice("marked item as unread");
                } else {
                    this.readItems.items.push(this.item);
                    readButton.setIcon('feather-eye-off');
                    new Notice("marked item as read");
                }
                await this.plugin.writeRead(() => (this.readItems));
            });

        const favoriteButton = new ButtonComponent(topButtons)
            .setIcon((this.favoriteItems.items.some(item => item.title === this.item.title)) ? 'star-glyph' : 'star')
            .setTooltip((this.favoriteItems.items.some(item => item.title === this.item.title) ? 'remove from favorites' : 'mark as favorite'))
            .onClick(async () => {
                if (this.favoriteItems.items.some(item => item.title === this.item.title)) {
                    this.favoriteItems.items.remove(this.item);
                    favoriteButton.setIcon('star');
                    new Notice("removed item from favorites");
                } else {
                    this.favoriteItems.items.push(this.item);
                    favoriteButton.setIcon('star-glyph');
                    new Notice("added item to favorites");
                }
                await this.plugin.writeFavorites(() => (this.favoriteItems));
            });

        new ButtonComponent(topButtons).setTooltip("open in browser").setIcon("open-elsewhere-glyph").onClick(() => {
            if (typeof this.item.link === "string") {
                window.open(this.item.link, '_blank');
            }
        });

        new ButtonComponent(topButtons).setTooltip("Add as new note").setIcon("create-new").onClick(async () => {
            const activeFile = this.app.workspace.getActiveFile();
            const dir = this.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").name;
            const title = this.item.title.replace(/[\/\\\:]/g, ' ');
            const filePath = normalizePath([dir, `${title}.md`].join('/'));
            let content = htmlToMarkdown(this.item.content);

            const appliedTemplate = this.plugin.settings.template
                .replace("{{title}}", this.item.title)
                .replace("{{link}}", this.item.link)
                .replace("{{author}}", this.item.creator)
                .replace("{{published}}", this.item.pubDate)
                .replace("{{content}}", content);

            //todo: check if file path is actually valid(does not contain : and so on)

            if (isInVault(this.app, filePath, '')) {
                new Notice("there is already a file with that name");
                return;
            }

            const file = await this.app.vault.create(filePath, appliedTemplate);
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (view) {
                await view.leaf.openFile(file, {
                    state: {mode: 'preview'},
                })
            }
            new Notice("Created note from feed");
        });

        new ButtonComponent(topButtons).setTooltip("paste to current note").setIcon("paste").onClick(() => {
            const file = this.app.workspace.getActiveFile();
            if (file === null) {
                new Notice("no file active");
                return;
            }

            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (view) {
                const editor = view.editor;
                editor.replaceRange(htmlToMarkdown(this.item.content), editor.getCursor());
                new Notice("inserted feed item into note");
            }
        });

        new ButtonComponent(topButtons).setTooltip("copy content to clipboard").setIcon("feather-clipboard").onClick(async () => {
            await copy(htmlToMarkdown(this.item.content));
        });

        let content = contentEl.createDiv('content');
        if (this.item.content) {
            content.append(sanitizeHTMLToDom(this.item.content));
        }
    }

    onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}
