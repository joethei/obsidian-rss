import {Feed} from "./Feed";

export interface Folder {
    id(): number;
    name(): string;
    feeds(): Feed[];
}
