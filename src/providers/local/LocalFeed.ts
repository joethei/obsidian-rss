import {Feed, FeedOrder} from "../Feed";
import {Item} from "../Item";
import {RssFeedContent} from "../../parser/rssParser";
import {LocalFeedItem} from "./LocalFeedItem";

export class LocalFeed implements Feed {

    private readonly parsed: RssFeedContent;

    constructor(parsed: RssFeedContent) {
        this.parsed = parsed;
    }


    favicon(): string {
        return this.parsed.image;
    }

    folderId(): number {
        return this.parsed.folder.length;
    }

    folderName(): string {
        return this.parsed.folder;
    }

    id(): number {
        return 0;
    }

    items(): Item[] {
        const result: Item[] = [];
        for (const item of this.parsed.items) {
            result.push(new LocalFeedItem(item));
        }
        return result;
    }

    link(): string {
        return this.parsed.link;
    }

    ordering(): FeedOrder {
        return FeedOrder.DEFAULT;
    }

    title(): string {
        return this.parsed.title;
    }

    unreadCount(): number {
        return 0;
    }

    url(): string {
        return this.parsed.link;
    }

}
