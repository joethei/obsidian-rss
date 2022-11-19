import {Feed, FeedOrder} from "../Feed";
import {NextcloudFeedProvider} from "./NextcloudFeedProvider";
import {Item} from "../Item";

export class NextCloudFeed implements Feed {

    private readonly provider: NextcloudFeedProvider;
    private readonly json: any;
    private readonly _items: Item[];

    constructor(provider: NextcloudFeedProvider, json: any, items: Item[]) {
        this.provider = provider;
        this.json = json;
        this._items = items;
    }

    favicon(): string {
        return this.json.faviconLink;
    }

    id(): number {
        return this.json.id;
    }

    link(): string {
        return this.json.link;
    }

    ordering(): FeedOrder {
        return this.json.ordering;
    }

    title(): string {
        return this.json.title;
    }

    unreadCount(): number {
        return this.json.unreadCount;
    }

    url(): string {
        return this.json.url;
    }

    folderId(): number {
        return this.json.folderId;
    }

    folderName(): string {
        return this.json.folderName;
    }

    items(): Item[] {
        return this._items;
    }

}
