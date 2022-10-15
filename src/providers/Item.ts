export interface Item {

    id(): string | number;
    guid(): string;
    guidHash(): string;
    url(): string;
    title(): string;
    author(): string;
    pubDate(): string;
    body(): string;
    description(): string;
    feedId(): number;
    read(): boolean;
    starred(): boolean;
    rtl(): boolean;
    mediaThumbnail(): string;
    mediaDescription(): string;
    enclosureMime(): string;
    enclosureLink(): string;
    markStarred(starred: boolean): void;
    markRead(read: boolean): void;
    tags(): string[];
    setTags(tags: string[]): void;
    created(): boolean;
    markCreated(created: boolean): void;
    language(): string | undefined;
    highlights(): string[];
    description(): string;
    folder(): string;
    feed(): string;
    language(): string | undefined;
}
