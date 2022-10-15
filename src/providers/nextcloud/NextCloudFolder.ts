import {Folder} from "../Folder";
import {NextcloudFeedProvider} from "./NextcloudFeedProvider";
import {Feed} from "../Feed";

export class NextCloudFolder implements Folder {
    private readonly provider: NextcloudFeedProvider;
    private readonly json: any;
    private readonly _feeds: Feed[];

    constructor(provider: NextcloudFeedProvider, json: any, feeds: Feed[]) {
        this.provider = provider;
        this.json = json;
        this._feeds = feeds;
    }

    id(): number {
        return this.json.id;
    }

    name(): string {
        return this.json.name;
    }

    feeds(): Feed[] {
        return this._feeds;
    }

}
