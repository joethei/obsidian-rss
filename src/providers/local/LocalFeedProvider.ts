import {FeedProvider} from "../FeedProvider";
import {Feed} from "../Feed";
import {Folder} from "../Folder";
import {Item} from "../Item";
import RssReaderPlugin from "../../main";
import {SettingsSection} from "../../settings/SettingsSection";
import {LocalFeedSettings} from "./LocalFeedSettings";

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

    warnings(): string[] {
        return [];
    }

    settings(containerEl: HTMLDivElement) : SettingsSection {
        return new LocalFeedSettings(this.plugin, containerEl);
    }

}
