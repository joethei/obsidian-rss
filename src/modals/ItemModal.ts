import {
    ButtonComponent,
    htmlToMarkdown,
    MarkdownRenderer,
    Menu,
    Modal,
} from "obsidian";
import RssReaderPlugin from "../main";
import Action from "../actions/Action";
import t from "../l10n/locale";
import {copy, rssToMd} from "../functions";
import {Item} from "../providers/Item";
import {pluginApi} from "@vanakat/plugin-api";

export class ItemModal extends Modal {

    private readonly plugin: RssReaderPlugin;
    private readonly item: Item;
    private readonly items: Item[];

    private readonly save: boolean;

    private readButton: ButtonComponent;
    private favoriteButton: ButtonComponent;

    constructor(plugin: RssReaderPlugin, item: Item, items: Item[], save = true) {
        super(plugin.app);
        this.plugin = plugin;
        this.items = items;
        this.item = item;
        this.save = save;


        if (this.save) {
            this.item.markRead(true);

            const feedContents = this.plugin.settings.items;
            this.plugin.writeFeedContent(() => {
                return feedContents;
            });

            if (!this.plugin.settings) {
                return;
            }

            if (this.plugin.settings.hotkeys.read) {
                this.scope.register([], this.plugin.settings.hotkeys.read, () => {
                    this.markAsRead();
                });
            }

            if (this.plugin.settings.hotkeys.favorite) {
                this.scope.register([], this.plugin.settings.hotkeys.favorite, () => {
                    this.markAsFavorite();
                });
            }

            if (this.plugin.settings.hotkeys.tags) {
                this.scope.register([], this.plugin.settings.hotkeys.tags, () => {
                    Action.TAGS.processor(this.plugin, this.item);
                });
            }
        }

        if (this.plugin.settings.hotkeys.create) {
            this.scope.register([], this.plugin.settings.hotkeys.create, () => {
                Action.CREATE_NOTE.processor(this.plugin, this.item);
            });
        }

        if (this.plugin.settings.hotkeys.paste) {
            this.scope.register([], this.plugin.settings.hotkeys.paste, () => {
                Action.PASTE.processor(this.plugin, this.item);
            });
        }

        if (this.plugin.settings.hotkeys.copy) {
            this.scope.register([], this.plugin.settings.hotkeys.copy, () => {
                Action.COPY.processor(this.plugin, this.item);
            });
        }

        if (this.plugin.settings.hotkeys.open) {
            this.scope.register([], this.plugin.settings.hotkeys.open, () => {
                Action.OPEN.processor(this.plugin, this.item);
            });
        }

        if (this.plugin.settings.hotkeys.next) {
            this.scope.register([], this.plugin.settings.hotkeys.next, () => {
                this.next();
            });
        }
        if (this.plugin.settings.hotkeys.previous) {
            this.scope.register([], this.plugin.settings.hotkeys.previous, () => {
                this.previous();
            });
        }
        if(window['PluginApi']) {
            const tts = pluginApi("tts");
            if (tts && this.plugin.settings.hotkeys.tts) {
                this.scope.register([], this.plugin.settings.hotkeys.tts, () => {
                    if (tts.isSpeaking()) {
                        if (tts.isPaused()) {
                            tts.resume();
                        } else {
                            tts.pause();
                        }
                        return;
                    }
                    const content = htmlToMarkdown(this.item.body());
                    tts.say(this.item.title(), content);
                });
            }
        }
    }

    previous(): void {
        let index = this.items.findIndex((item) => {
            return item === this.item;
        });
        index++;
        const item = this.items[index];
        if (item !== undefined) {
            this.close();
            new ItemModal(this.plugin, item, this.items, this.save).open();
        }
    }

    next(): void {
        let index = this.items.findIndex((item) => {
            return item === this.item;
        });
        index--;
        const item = this.items[index];
        if (item !== undefined) {
            this.close();
            new ItemModal(this.plugin, item, this.items, this.save).open();
        }
    }

    async markAsFavorite(): Promise<void> {
        await Action.FAVORITE.processor(this.plugin, this.item);
        this.favoriteButton.setIcon((this.item.starred()) ? 'star-glyph' : 'star');
        this.favoriteButton.setTooltip((this.item.starred()) ? t("remove_from_favorites") : t("mark_as_favorite"));
    }

    async markAsRead(): Promise<void> {
        await Action.READ.processor(this.plugin, this.item);
        this.readButton.setIcon((this.item.read()) ? 'eye-off' : 'eye');
        this.readButton.setTooltip((this.item.read()) ? t("mark_as_unread") : t("mark_as_unread"));
    }

    async display(): Promise<void> {
        this.modalEl.addClass("rss-modal");
        const {contentEl} = this;
        contentEl.empty();

        //don't add any scrolling to modal content
        contentEl.style.height = "100%";
        contentEl.style.overflowY = "hidden";

        const topButtons = contentEl.createDiv('topButtons');

        let actions = Array.of(Action.CREATE_NOTE, Action.PASTE, Action.COPY, Action.OPEN);

        if (this.save) {
            this.readButton = new ButtonComponent(topButtons)
                .setIcon(this.item.read ? 'eye-off' : 'eye')
                .setTooltip(this.item.read ? t("mark_as_unread") : t("mark_as_read"))
                .onClick(async () => {
                    await this.markAsRead();
                });
            this.readButton.buttonEl.setAttribute("tabindex", "-1");
            this.readButton.buttonEl.addClass("rss-button");

            this.favoriteButton = new ButtonComponent(topButtons)
                .setIcon(this.item.starred() ? 'star-glyph' : 'star')
                .setTooltip(this.item.starred() ? t("remove_from_favorites") : t("mark_as_favorite"))
                .onClick(async () => {
                    await this.markAsFavorite();
                });
            this.favoriteButton.buttonEl.setAttribute("tabindex", "-1");
            this.favoriteButton.buttonEl.addClass("rss-button");

            actions = Array.of(Action.TAGS, ...actions);
        }


        actions.forEach((action) => {
            const button = new ButtonComponent(topButtons)
                .setIcon(action.icon)
                .setTooltip(action.name)
                .onClick(async () => {
                    await action.processor(this.plugin, this.item);
                });
            button.buttonEl.setAttribute("tabindex", "-1");
            button.buttonEl.addClass("rss-button");
        });
        if(window['PluginApi']) {
            const tts = pluginApi("tts");
            if (tts) {
                const ttsButton = new ButtonComponent(topButtons)
                    .setIcon("headphones")
                    .setTooltip(t("read_article_tts"))
                    .onClick(async () => {
                        const content = htmlToMarkdown(this.item.body());
                        await tts.say(this.item.title, content, this.item.language());
                    });
                ttsButton.buttonEl.addClass("rss-button");
            }
        }

        const prevButton = new ButtonComponent(topButtons)
            .setIcon("left-arrow-with-tail")
            .setTooltip(t("previous"))
            .onClick(() => {
                this.previous();
            });
        prevButton.buttonEl.addClass("rss-button");

        const nextButton = new ButtonComponent(topButtons)
            .setIcon("right-arrow-with-tail")
            .setTooltip(t("next"))
            .onClick(() => {
                this.next();
            });
        nextButton.buttonEl.addClass("rss-button");

        contentEl.createEl('h1', {cls: ["rss-title", "rss-selectable"], text: this.item.title()});

        const subtitle = contentEl.createEl("h3", "rss-subtitle");
        subtitle.addClass("rss-selectable");
        if (this.item.author()) {
            subtitle.appendText(this.item.author());
        }
        if (this.item.pubDate) {
            subtitle.appendText(" - " + window.moment(this.item.pubDate()).format(this.plugin.settings.dateFormat));
        }
        const tagEl = contentEl.createSpan("tags");
        this.item.tags().forEach((tag) => {
            const tagA = tagEl.createEl("a");
            tagA.setText(tag);
            tagA.addClass("tag", "rss-tag");
        });

        const content = contentEl.createDiv('rss-content');
        content.addClass("rss-scrollable-content", "rss-selectable");

        if (this.item.enclosureLink() && this.plugin.settings.displayMedia) {
            if (this.item.enclosureMime().toLowerCase().contains("audio")) {
                const audio = content.createEl("audio", {attr: {controls: "controls"}});
                audio.createEl("source", {attr: {src: this.item.enclosureLink(), type: this.item.enclosureMime()}});
            }
            if (this.item.enclosureMime().toLowerCase().contains("video")) {
                const video = content.createEl("video", {attr: {controls: "controls", width: "100%", height: "100%"}});
                video.createEl("source", {attr: {src: this.item.enclosureLink(), type: this.item.enclosureMime()}});
            }

            //embedded yt player
            if (this.item.enclosureLink() && typeof this.item.id() === "string" && (this.item.id() as string).startsWith("yt:")) {
                content.createEl("iframe", {
                    attr: {
                        type: "text/html",
                        src: "https://www.youtube.com/embed/" + this.item.enclosureLink(),
                        width: "100%",
                        height: "100%",
                        allowFullscreen: "true"
                    }
                });
            }
        }

        if (this.item.body()) {
            //prepend empty yaml to fix rendering errors
            const markdown = "---\n---" + rssToMd(this.plugin, this.item.body());

            await MarkdownRenderer.renderMarkdown(markdown, content, "", this.plugin);

            this.item.highlights().forEach(highlight => {
                if (content.innerHTML.includes(highlight)) {
                    const newNode = contentEl.createEl("mark");
                    newNode.innerHTML = highlight;
                    content.innerHTML = content.innerHTML.replace(highlight, newNode.outerHTML);
                    newNode.remove();
                } else {
                    console.log("Highlight not included");
                    console.log(highlight);
                }
            });

            content.addEventListener('contextmenu', (event) => {
                event.preventDefault();

                const selection = document.getSelection();
                const range = selection.getRangeAt(0);

                const div = contentEl.createDiv();
                const htmlContent = range.cloneContents();
                const html = htmlContent.cloneNode(true);
                div.appendChild(html);
                const selected = div.innerHTML;
                div.remove();

                const menu = new Menu();

                let previousHighlight: HTMLElement;
                if (this.item.highlights().includes(range.startContainer.parentElement.innerHTML)) {
                    previousHighlight = range.startContainer.parentElement;
                }
                if (this.item.highlights().includes(range.startContainer.parentElement.parentElement.innerHTML)) {
                    previousHighlight = range.startContainer.parentElement.parentElement;
                }

                if(previousHighlight) {
                    menu.addItem(item => {
                        item
                            .setIcon("highlight-glyph")
                            .setTitle(t("highlight_remove"))
                            .onClick(async () => {
                                const replacement = contentEl.createSpan();
                                replacement.innerHTML = previousHighlight.innerHTML;
                                previousHighlight.replaceWith(replacement);
                                this.item.highlights().remove(previousHighlight.innerHTML);

                                const feedContents = this.plugin.settings.items;
                                await this.plugin.writeFeedContent(() => {
                                    return feedContents;
                                });
                            });
                    });
                }else if(!this.item.highlights().includes(selected) && selected.length > 0) {
                    menu.addItem(item => {
                        item
                            .setIcon("highlight-glyph")
                            .setTitle(t("highlight"))
                            .onClick(async () => {
                                const newNode = contentEl.createEl("mark");
                                newNode.innerHTML = selected;
                                range.deleteContents();
                                range.insertNode(newNode);
                                this.item.highlights().push(selected);

                                const feedContents = this.plugin.settings.items;
                                await this.plugin.writeFeedContent(() => {
                                    return feedContents;
                                });

                                //cleaning up twice to remove nested elements
                                this.removeDanglingElements(contentEl);
                                this.removeDanglingElements(contentEl);
                            });
                    });
                }

                if(selected.length > 0) {
                    menu
                        .addItem(item => {
                            item
                                .setIcon("documents")
                                .setTitle(t("copy_to_clipboard"))
                                .onClick(async () => {
                                    await copy(selection.toString());
                                });
                        });
                    //@ts-ignore
                    if (this.app.plugins.plugins["obsidian-tts"]) {
                        menu.addItem(item => {
                            item
                                .setIcon("headphones")
                                .setTitle(t("read_article_tts"))
                                .onClick(() => {
                                    //@ts-ignore
                                    const tts = this.app.plugins.plugins["obsidian-tts"].ttsService;
                                    tts.say("", selection.toString());
                                });
                        });
                    }
                }

                menu.showAtMouseEvent(event);
            });
        }
    }

    async onClose(): Promise<void> {
        const {contentEl} = this;
        contentEl.empty();

        const feedContents = this.plugin.settings.items;
        await this.plugin.writeFeedContent(() => {
            return feedContents;
        });
    }

    async onOpen(): Promise<void> {
        await this.display();
    }

    removeDanglingElements(el: HTMLElement) : void {
        //remove wallabag.xml dangling elements
        const lists = el.querySelectorAll('li, a, div, p, span');
        for (let i = 0; i < lists.length; i++) {
            const listEL = lists.item(i);
            if(listEL.innerHTML === '') {
                listEL.remove();
            }
        }
    }

}
