import {Feed} from "./Feed";
import {Folder} from "./Folder";
import {Item} from "./Item";
import {SettingsSection} from "../settings/SettingsSection";

export interface FeedProvider {

    id(): string;

    name(): string;

    isValid(): Promise<boolean>;

    warnings() : string[];

    folders(): Promise<Folder[]>;

    filteredFolders() : Promise<Folder[]>;

    feeds(): Promise<Feed[]>;

    items() : Promise<Item[]>;

    settings(containerEl: HTMLDivElement) : SettingsSection;
}
