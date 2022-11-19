import {Folder} from "../Folder";
import {Feed} from "../Feed";

export class NextCloudFolder implements Folder {
    private readonly json: any;
    private readonly _feeds: Feed[];

    constructor(json: any, feeds: Feed[]) {
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
