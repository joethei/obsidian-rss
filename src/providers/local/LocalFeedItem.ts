import {Item} from "../Item";
import {RssFeedItem} from "../../parser/rssParser";

export class LocalFeedItem implements Item {

    private readonly item: RssFeedItem;

    constructor(item: RssFeedItem) {
        this.item = item;
    }

    author(): string {
        return this.item.creator;
    }

    body(): string {
        return this.item.content;
    }

    created(): boolean {
        return false;
    }

    description(): string {
        return this.item.description;
    }

    enclosureLink(): string {
        return "";
    }

    enclosureMime(): string {
        return "";
    }

    feed(): string {
        return "";
    }

    feedId(): number {
        return 0;
    }

    folder(): string {
        return "";
    }

    guid(): string {
        return "";
    }

    guidHash(): string {
        return "";
    }

    highlights(): string[] {
        return [];
    }

    id(): string | number {
        return undefined;
    }

    language(): string | undefined {
        return this.item.language;
    }

    markCreated(created: boolean): void {

    }

    markRead(read: boolean): void {
    }

    markStarred(starred: boolean): void {
    }

    mediaDescription(): string {
        return "";
    }

    mediaThumbnail(): string {
        return "";
    }

    pubDate(): string {
        return this.item.pubDate;
    }

    read(): boolean {
        return false;
    }

    rtl(): boolean {
        return false;
    }

    setTags(tags: string[]): void {
    }

    starred(): boolean {
        return false;
    }

    tags(): string[] {
        return [];
    }

    title(): string {
        return this.item.title;
    }

    url(): string {
        return this.item.link;
    }

}
