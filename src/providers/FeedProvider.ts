import {Feed} from "./Feed";
import {Folder} from "./Folder";
import RssReaderPlugin from "../main";
import {Item} from "./Item";

export interface FeedProvider {

    id(): string;

    name(): string;

    isValid(): Promise<boolean>;

    warnings() : string[];

    folders(): Promise<Folder[]>;

    filteredFolders() : Promise<Folder[]>;

    feeds(): Promise<Feed[]>;

    items() : Promise<Item[]>;

    displaySettings(plugin: RssReaderPlugin, container: HTMLElement): void;

}
