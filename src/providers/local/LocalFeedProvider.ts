import {FeedProvider} from "../FeedProvider";
import {Feed} from "../Feed";
import {Folder} from "../Folder";
import {Item} from "../Item";
import RssReaderPlugin from "../../main";
import {SettingsSection} from "../../settings/SettingsSection";
import {LocalFeedSettings} from "./LocalFeedSettings";
import {LocalFeed} from "./LocalFeed";
import groupBy from "lodash.groupby";
import {LocalFolder} from "./LocalFolder";
import {getFeedItems} from "../../parser/rssParser";

export class LocalFeedProvider implements FeedProvider {
    private readonly plugin: RssReaderPlugin;

    constructor(plugin: RssReaderPlugin) {
        this.plugin = plugin;
    }

    async isValid(): Promise<boolean> {
        return true;
    }

    id(): string {
        return "local";
    }

    name(): string {
        return "Local";
    }

    async feeds(): Promise<Feed[]> {
        const result: Feed[] = [];
        const feeds = this.plugin.settings.feeds;
        for (const feed of feeds) {
            const content = await getFeedItems(feed);
            result.push(new LocalFeed(content));
        }

        return result;
    }

    async feedFromUrl(url: string): Promise<Feed> {
        const feed = {
            name: '',
            url,
            folder: '',
        }
        const content = await getFeedItems(feed);
        return new LocalFeed(content);
    }

    async filteredFolders(): Promise<Folder[]> {
        return [];
    }


    async folders(): Promise<Folder[]> {
        const result: Folder[] = [];
        const feeds = await this.feeds();
        const grouped = groupBy(feeds, item => item.folderName());

        for (const key of Object.keys(grouped)) {
            const folderContent = grouped[key];
            result.push(new LocalFolder(key, folderContent));
        }
        return result;
    }

    async items(): Promise<Item[]> {
        return [];
    }

    warnings(): string[] {
        return [];
    }

    settings(containerEl: HTMLDivElement): SettingsSection {
        return new LocalFeedSettings(this.plugin, containerEl);
    }

}
