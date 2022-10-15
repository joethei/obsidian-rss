import {Item} from "./Item";

export enum FeedOrder {
    DEFAULT,
    OLDEST_FIRST,
    NEWEST_FIRST,
}


export interface Feed {
    id(): number;
    url(): string;
    title(): string;
    favicon(): string;
    unreadCount(): number;
    ordering(): FeedOrder;
    link(): string;
    folderId(): number;
    items(): Item[];
}
