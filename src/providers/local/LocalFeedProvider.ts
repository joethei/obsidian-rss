import {FeedProvider} from "../FeedProvider";
import {Feed} from "../Feed";
import {Folder} from "../Folder";
import {Item} from "../Item";
import RssReaderPlugin from "../../main";
import {displayFilterSettings} from "../../settings/FilterSettings";
import {displayFeedSettings} from "../../settings/FeedSettings";
import {displayHotkeys} from "../../settings/HotkeySettings";

export class LocalFeedProvider implements FeedProvider {
    private readonly plugin: RssReaderPlugin;

    constructor(plugin: RssReaderPlugin) {
        this.plugin = plugin;
    }

    async isValid(): Promise<boolean> {
        return false;
    }

    id(): string {
        return "local";
    }

    name(): string {
        return "Local";
    }

    async feeds(): Promise<Feed[]> {
        return [];
    }

    async filteredFolders(): Promise<Folder[]> {
        return [];
    }

    async folders(): Promise<Folder[]> {
        return [];
    }

    async items(): Promise<Item[]> {
        return [];
    }

    displaySettings(plugin: RssReaderPlugin, container: HTMLElement) {
        const filterContainer = container.createDiv("filter-container");
        displayFilterSettings(this.plugin, filterContainer);

        const feedsContainer = container.createDiv(
            "feed-container"
        );
        displayFeedSettings(this.plugin, feedsContainer);

        container.createEl("hr", {cls: "rss-divider"});

        const hotkeyContainer = container.createDiv("hotkey-container");
        displayHotkeys(this.plugin, hotkeyContainer);
    }

    warnings(): string[] {
        return [];
    }

}
