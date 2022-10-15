import {Item} from "../Item";
import {NextcloudFeedProvider} from "./NextcloudFeedProvider";

export class NextCloudItem implements Item{

    private readonly provider: NextcloudFeedProvider;
    private readonly json: any;

    constructor(provider: NextcloudFeedProvider, json: any) {
        this.provider = provider;
        this.json = json;
    }

    public author(): string {
        return this.json.author;
    }

    public body(): string {
        return this.json.body;
    }

    public enclosureLink(): string {
        return this.json.enclosureLink;
    }

    public enclosureMime(): string {
        return this.json.enclosureMime;
    }

    public feedId(): number {
        return this.json.feedId;
    }

    public id(): number {
        return this.json.id;
    }

    public guid(): string {
        return this.json.guid;
    }

    public guidHash(): string {
        return this.json.guidHash;
    }

    public mediaDescription(): string {
        return this.json.mediaDescription;
    }

    public mediaThumbnail(): string {
        return this.json.mediaThumbnail;
    }

    public pubDate(): string {
        return this.json.pubDate;
    }

    public read(): boolean {
        return !this.json.unread;
    }

    public rtl(): boolean {
        return this.json.rtl;
    }

    public starred(): boolean {
        return this.json.starred;
    }

    public title(): string {
        return this.json.title;
    }

    public url(): string {
        return this.json.url;
    }

    tags(): string[] {
        return [];
    }

    setTags(tags: string[]) {

    }

    created(): boolean {
        return false;
    }

    markCreated(created: boolean) {

    }

    language(): string | undefined {
        return undefined;
    }

    highlights(): string[] {
        return [];
    }

    description(): string {
        return "";
    }

    folder(): string {
        return "";
    }

    feed(): string {
        return "";
    }

    public async markStarred(starred: boolean) {
        this.json.starred = starred;
        if(starred) {
            await this.provider.putData(`items/${this.feedId()}/${this.guidHash()}/star`);
        }else {
            await this.provider.putData(`items/${this.feedId()}/${this.guidHash()}/unstar`);
        }
    }

    public async markRead(read: boolean) {
        this.json.unread = !read;
        if(read) {
            await this.provider.putData(`items/${this.id()}/read`);
        }else {
            await this.provider.putData(`items/${this.id()}/unread`);
        }
    }

}
