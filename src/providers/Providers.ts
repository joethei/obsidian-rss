import {FeedProvider} from "./FeedProvider";
import RssReaderPlugin from "../main";

export class Providers {
    private plugin: RssReaderPlugin;
    private providers: FeedProvider[] = [];

    constructor(plugin: RssReaderPlugin) {
        this.plugin = plugin;
    }

    getAll(): FeedProvider[] {
        return this.providers;
    }

    getCurrent() : FeedProvider {
        return this.providers.filter(provider => provider.id() === this.plugin.settings.provider).first();
    }

    register(provider: FeedProvider) : void {
        this.providers.push(provider);
    }

}
