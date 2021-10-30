import {
    ButtonComponent,
    htmlToMarkdown,
    MarkdownView,
    Modal,
    normalizePath,
    Notice, TextComponent,
} from "obsidian";
import {RssFeedItem} from "./rssParser";
import {favoritesStore, FeedItems, readStore} from "./stores";
import RssReaderPlugin from "./main";
import {get} from "svelte/store";
import {copy, isInVault} from "obsidian-community-lib";
import {FILE_NAME_REGEX, sanitizeHTMLToDom} from "./consts";
import {TextInputPrompt} from "./TextInputPrompt";

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
            if (typeof this.item.link === "string") {
                window.open(this.item.link, '_blank');
            }
        });

        new ButtonComponent(topButtons).setTooltip("Add as new note").setIcon("create-new").onClick(async () => {
            const activeFile = this.app.workspace.getActiveFile();
            const dir = this.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").name;
            //make sure there are now slashes in the title.
            const title = this.item.title.replace(/[\/\\:]/g, ' ');
            const content = htmlToMarkdown(this.item.content);

            const appliedTemplate = this.plugin.settings.template
                .replace("{{title}}", this.item.title)
                .replace("{{link}}", this.item.link)
                .replace("{{author}}", this.item.creator)
                .replace("{{published}}", this.item.pubDate)
                .replace("{{content}}", content);

            const inputPrompt = new TextInputPrompt(this.app, "Please specify a file name", "cannot contain: * \" \\ / < > : | ?", title, title);

            await inputPrompt
                .openAndGetValue(async (text: TextComponent) => {
                    const value = text.getValue();
                    if(value.match(FILE_NAME_REGEX)) {
                        inputPrompt.setValidationError(text, "that filename is not valid");
                        return;
                    }
                    const filePath = normalizePath([dir, `${value}.md`].join('/'));

                    if (isInVault(this.app, filePath, '')) {
                        inputPrompt.setValidationError(text, "there is already a note with that name");
                        return;
                    }

                    this.close();
                    inputPrompt.close();

                    const file = await this.app.vault.create(filePath, appliedTemplate);

                    await this.app.workspace.activeLeaf.openFile(file, {
                        state: {mode: 'edit'},
                    })
                    new Notice("Created note from article");
            });
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
                new Notice("inserted article into note");
            }
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
