import {FilteredFolder} from "../modals/FilteredFolderModal";
import {RssFeedContent} from "../parser/rssParser";

export interface RssFeed {
    name: string,
    url: string,
    folder: string,
}

export interface RssReaderSettings {
    feeds: RssFeed[],
    template: string,
    pasteTemplate: string,
    updateTime: number,
    saveLocation: string,
    saveLocationFolder: string,
    filtered: FilteredFolder[],
    items: RssFeedContent[],
    dateFormat: string,
    askForFilename: boolean,
    defaultFilename: string,
    autoSync: boolean,
    hotkeys: {
        create: string,
        paste: string,
        copy: string,
        favorite: string,
        read: string,
        tags: string,
        open: string,
        tts: string
    },
    folded: string[]
}

export const DEFAULT_SETTINGS: RssReaderSettings = Object.freeze({
    feeds: [],
    updateTime: 60,
    filtered: [{
        name: "Favorites",
        filterType: "FAVORITES",
        filterContent: "",
        sortOrder: "ALPHABET_NORMAL"
    }],
    saveLocation: 'default',
    saveLocationFolder: '',
    items: [],
    dateFormat: "YYYY-MM-DDTHH:MM:SS",
    template: "---\n" +
        "link: {{link}}\n" +
        "author: {{author}}\n" +
        "published: {{published}}\n" +
        "tags: [{{tags:,}}]\n" +
        "---\n" +
        "{{title}}\n" +
        "{{content}}",
    pasteTemplate: "## {{title}}\n" +
        "{{content}}",
    askForFilename: true,
    defaultFilename: "{{title}}",
    autoSync: false,
    hotkeys: {
        create: "n",
        paste: "v",
        copy: "c",
        favorite: "f",
        read: "r",
        tags: "t",
        open: "o",
        tts: "s"
    },
    folded: []
});

