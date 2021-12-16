import {moment, SuggestModal} from "obsidian";
import {RssFeedItem} from "../parser/rssParser";
import RssReaderPlugin from "../main";
import {ItemModal} from "./ItemModal";

export class ArticleSuggestModal extends SuggestModal<RssFeedItem> {

    plugin: RssReaderPlugin;
    items: RssFeedItem[];

    constructor(plugin: RssReaderPlugin, items: RssFeedItem[]) {
        super(plugin.app);
        this.plugin = plugin;
        this.items = items;
    }

    getItems(): RssFeedItem[] {
        return this.items;
    }

    onChooseSuggestion(item: RssFeedItem, evt: MouseEvent | KeyboardEvent): void {
        this.close();
        new ItemModal(this.plugin, item, this.items, false).open();
    }

    getSuggestions(query: string): RssFeedItem[] {
        return this.items.filter((item) => {
           return item.title.toLowerCase().includes(query.toLowerCase()) || item.content.toLowerCase().includes(query.toLowerCase());
        });
    }

    renderSuggestion(item: RssFeedItem, el: HTMLElement) {
        el.createEl("div", { text: item.title });
        el.createEl("small", { text: moment(item.pubDate).format(this.plugin.settings.dateFormat) + " " + item.creator });
    }

}
