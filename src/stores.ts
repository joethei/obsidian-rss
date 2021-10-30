import {writable} from "svelte/store";
import {DEFAULT_SETTINGS, RssFeed, RssReaderSettings} from "./settings/settings";
import {RssFeedItem, RssFeedMap} from "./parser/rssParser";
import Array from "obsidian";

export interface FeedItems {
    items: RssFeedItem[];
}

export const configuredFeedsStore = writable<Array<RssFeed>>([]);
export const favoritesStore =  writable<FeedItems>({items: []});
export const readStore = writable<FeedItems>({items: []});
export const settingsStore = writable<RssReaderSettings>(DEFAULT_SETTINGS);

export const feedsStore = writable<Array<RssFeedMap>>([]);
export const sortedFeedsStore = writable<_.Dictionary<RssFeedMap[]>>();
