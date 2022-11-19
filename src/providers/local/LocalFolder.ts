import {Folder} from "../Folder";
import {Feed} from "../Feed";

export class LocalFolder implements Folder {

    private readonly _name: string;
    private readonly _feeds: Feed[];

    constructor(name: string, feeds: Feed[]) {
        this._name = name;
        this._feeds = feeds;
    }

    feeds(): Feed[] {
        return this._feeds;
    }

    id(): number {
        return 0;
    }

    name(): string {
        return this._name;
    }

}
