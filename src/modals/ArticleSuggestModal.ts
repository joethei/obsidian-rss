import {moment, SuggestModal} from "obsidian";
import RssReaderPlugin from "../main";
import {ItemModal} from "./ItemModal";
import {Item} from "../providers/Item";

export class ArticleSuggestModal extends SuggestModal<Item> {

    plugin: RssReaderPlugin;
    items: Item[];

    constructor(plugin: RssReaderPlugin, items: Item[]) {
        super(plugin.app);
        this.plugin = plugin;
        this.items = items;
    }

    getItems(): Item[] {
        return this.items;
    }

    onChooseSuggestion(item: Item, _: MouseEvent | KeyboardEvent): void {
        this.close();
        new ItemModal(this.plugin, item, this.items, false).open();
    }

    getSuggestions(query: string): Item[] {
        return this.items.filter((item) => {
           return item.title().toLowerCase().includes(query.toLowerCase()) || item.body().toLowerCase().includes(query.toLowerCase());
        });
    }

    renderSuggestion(item: Item, el: HTMLElement) : void {
        el.createEl("div", { text: item.title() });
        el.createEl("small", { text: moment(item.pubDate()).format(this.plugin.settings.dateFormat) + " " + item.author() });
    }

}
