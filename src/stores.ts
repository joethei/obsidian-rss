import {writable} from "svelte/store";
import {DEFAULT_SETTINGS, RssReaderSettings} from "./settings";

export const settingsWrit = writable<RssReaderSettings>(DEFAULT_SETTINGS);
