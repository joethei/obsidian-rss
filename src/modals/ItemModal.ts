import {
    ButtonComponent, htmlToMarkdown, MarkdownRenderer,
    Modal,
} from "obsidian";
import {RssFeedItem} from "../parser/rssParser";
import RssReaderPlugin from "../main";
import Action from "../actions/Action";
import t from "../l10n/locale";

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

        if (this.plugin.settings.hotkeys.tags) {
            this.scope.register([], this.plugin.settings.hotkeys.tags, () => {
                Action.TAGS.processor(this.plugin, this.item);
            });
        }

        if (this.plugin.settings.hotkeys.open) {
            this.scope.register([], this.plugin.settings.hotkeys.open, () => {
                Action.OPEN.processor(this.plugin, this.item);
            });
        }


        //@ts-ignore
        if (this.app.plugins.plugins["obsidian-tts"] && this.plugin.settings.hotkeys.tts) {
            this.scope.register([], this.plugin.settings.hotkeys.tts, () => {
                //@ts-ignore
                const tts = this.app.plugins.plugins["obsidian-tts"].ttsService;
                if (tts.isSpeaking()) {
                    if (tts.isPaused()) {
                        tts.resume();
                    } else {
                        tts.pause();
                    }
                    return;
                }
                const content = htmlToMarkdown(this.item.content);
                tts.say(this.item.title, content, this.item.language);
            });
        }
    }

    async markAsFavorite(): Promise<void> {
        await Action.FAVORITE.processor(this.plugin, this.item);
        this.favoriteButton.setIcon((this.item.favorite) ? 'star-glyph' : 'star');
        this.favoriteButton.setTooltip((this.item.favorite) ? t("remove_from_favorites") : t("mark_as_favorite"));
    }

    async markAsRead(): Promise<void> {
        await Action.READ.processor(this.plugin, this.item);
        this.readButton.setIcon((this.item.read) ? 'feather-eye-off' : 'feather-eye');
        this.readButton.setTooltip((this.item.read) ? t("mark_as_unread") : t("mark_as_unread"));
    }

    async display(): Promise<void> {
        const {contentEl} = this;
        contentEl.empty();

        //don't add any scrolling to modal content
        contentEl.style.height = "100%";
        contentEl.style.overflowY = "hidden";

        const topButtons = contentEl.createSpan('topButtons');

        this.readButton = new ButtonComponent(topButtons)
            .setIcon(this.item.read ? 'feather-eye-off' : 'feather-eye')
            .setTooltip(this.item.read ? t("mark_as_unread") : t("mark_as_read"))
            .onClick(async () => {
                await this.markAsRead();
            });
        this.readButton.buttonEl.setAttribute("tabindex", "-1");

        this.favoriteButton = new ButtonComponent(topButtons)
            .setIcon(this.item.favorite ? 'star-glyph' : 'star')
            .setTooltip(this.item.favorite ? t("remove_from_favorites") : t("mark_as_favorite"))
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
        //@ts-ignore
        if (this.app.plugins.plugins["obsidian-tts"]) {
            new ButtonComponent(topButtons)
                .setIcon("feather-headphones")
                .setTooltip(t("read_article_tts"))
                .onClick(async () => {
                    const content = htmlToMarkdown(this.item.content);
                    //@ts-ignore
                    await this.app.plugins.plugins["obsidian-tts"].ttsService.say(this.item.title, content, this.item.language);
                });
        }

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

        const content = contentEl.createDiv('rss-content');
        content.addClass("scrollable-content");

        if (this.item.enclosure) {
            if (this.item.enclosureType.toLowerCase().contains("audio")) {
                const audio = content.createEl("audio", {attr: {controls: "controls"}});
                audio.createEl("source", {attr: {src: this.item.enclosure, type: this.item.enclosureType}});
            }
            if (this.item.enclosureType.toLowerCase().contains("video")) {
                const video = content.createEl("video", {attr: {controls: "controls", width: "100%", height: "100%"}});
                video.createEl("source", {attr: {src: this.item.enclosure, type: this.item.enclosureType}});
            }

            //embeded yt player
            if (this.item.enclosure && this.item.id.startsWith("yt:")) {
                content.createEl("iframe", {
                    attr: {
                        type: "text/html",
                        src: "http://www.youtube.com/embed/" + this.item.enclosure,
                        width: "100%",
                        height: "100%",
                        allowFullscreen: "true"

                    }
                });
            }
        }

        if (this.item.content) {
            await MarkdownRenderer.renderMarkdown(htmlToMarkdown(this.item.content), content, "", this.plugin);
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
