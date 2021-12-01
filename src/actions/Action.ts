import {RssFeedItem} from "../parser/rssParser";
import {createNewNote, openInBrowser, pasteToNote} from "../functions";
import RssReaderPlugin from "../main";
import {htmlToMarkdown, Notice} from "obsidian";
import {copy} from "obsidian-community-lib";
import {TagModal} from "../modals/TagModal";
import t from "../l10n/locale";

export default class Action {

    static CREATE_NOTE = new Action(t("create_note"), "create-new", (plugin, item) : Promise<void> => {
        return createNewNote(plugin, item);
    });

    static PASTE = new Action(t("paste_to_note"), "paste", (plugin, item) : Promise<void> => {
        return pasteToNote(plugin, item);
    });

    static COPY = new Action(t("copy_to_clipboard"), "feather-clipboard", ((_, item) : Promise<void> => {
        return copy(htmlToMarkdown(item.content));
    }));

    static OPEN = new Action(t("open_browser"), "open-elsewhere-glyph", ((_, item) : Promise<void> => {
        openInBrowser(item);
        return Promise.resolve();
    }));

    static TAGS = new Action(t("edit_tags"), "tag-glyph", (((plugin, item) => {
        const modal = new TagModal(plugin, item.tags);

        modal.onClose = async () => {
            item.tags = modal.tags;
            const items = plugin.settings.items;
            await plugin.writeFeedContent(() => {
                return items;
            });
        };

        modal.open();
        return Promise.resolve();
    })));

    static READ = new Action(t("mark_as_read_unread"), "feather-eye", ((async (plugin, item) : Promise<void> => {
        if (item.read) {
            item.read = false;
            new Notice(t("marked_as_unread"));
        } else {
            item.read = true;
            new Notice(t("marked_as_read"));
        }
        const items = plugin.settings.items;
        await plugin.writeFeedContent(() => {
            return items;
        });
        return Promise.resolve();
    })));

    static FAVORITE = new Action(t("mark_as_favorite_remove"), "star", ((async (plugin, item) : Promise<void> => {
        if (item.favorite) {
            item.favorite = false;
            new Notice(t("removed_from_favorites"));
        } else {
            item.favorite = true;
            new Notice(t("added_to_favorites"));
        }
        const items = plugin.settings.items;
        await plugin.writeFeedContent(() => {
            return items;
        });
        return Promise.resolve();
    })));

    static actions = Array.of(Action.FAVORITE, Action.READ, Action.TAGS, Action.CREATE_NOTE, Action.PASTE, Action.COPY, Action.OPEN);

    readonly name: string;
    readonly icon: string;
    readonly processor: (plugin: RssReaderPlugin, value: RssFeedItem) => Promise<void>;

    constructor(name: string, icon: string, processor: (plugin: RssReaderPlugin, item: RssFeedItem) => Promise<void>) {
        this.name = name;
        this.icon = icon;
        this.processor = processor;
    }
}
