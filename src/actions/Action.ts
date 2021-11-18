import {RssFeedItem} from "../parser/rssParser";
import {createNewNote, openInBrowser, pasteToNote} from "../functions";
import RssReaderPlugin from "../main";
import {htmlToMarkdown} from "obsidian";
import {copy} from "obsidian-community-lib";
import {TagModal} from "../modals/TagModal";

export default class Action {

    static CREATE_NOTE = new Action("create new note", "create-new", (plugin, item) : Promise<void> => {
        return createNewNote(plugin, item);
    });

    static PASTE = new Action("paste to current note", "paste", (plugin, item) : Promise<void> => {
        return pasteToNote(plugin, item);
    });
    static COPY = new Action("copy to clipboard", "feather-clipboard", ((_, item) : Promise<void> => {
        return copy(htmlToMarkdown(item.content));
    }));
    static OPEN = new Action("open in browser", "open-elsewhere-glyph", ((_, item) : Promise<void> => {
        openInBrowser(item);
        return Promise.resolve();
    }));
    static TAGS = new Action("edit tags", "tag-glyph", (((plugin, item) => {
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

    static actions = Array.of(Action.TAGS, Action.CREATE_NOTE, Action.PASTE, Action.COPY, Action.OPEN);

    readonly name: string;
    readonly icon: string;
    readonly processor: (plugin: RssReaderPlugin, value: RssFeedItem) => Promise<void>;

    constructor(name: string, icon: string, processor: (plugin: RssReaderPlugin, item: RssFeedItem) => Promise<void>) {
        this.name = name;
        this.icon = icon;
        this.processor = processor;
    }
}
