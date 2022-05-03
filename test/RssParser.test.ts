import {RssFeed} from "../src/settings/settings";
import {getFeedItems} from "../src/parser/rssParser";

describe('invalid', () => {
    test('not xml', async () => {
        const feed: RssFeed = {
            name: "Invalid",
            url: "./invalid.xml",
            folder: ""
        };
        const result = await getFeedItems(feed);
        expect(result).toBeUndefined();

    });
    test('Not a RSS feed', async () => {
        const feed: RssFeed = {
            name: "Invalid",
            url: "./example.org.xml",
            folder: ""
        };
        const result = await getFeedItems(feed);
        expect(result.items.length).toEqual(0);
        expect(result.name).toEqual(feed.name);
        expect(result.folder).toEqual(feed.folder);
        expect(result.image).toBeNull();

    });
});

describe('Wallabag', () => {
    test('live', async () => {
        const feed: RssFeed = {
            name: "Wallabag",
            url: "https://wallabag.joethei.de/feed/testUser/vPKtC7bLgxvUmkF/all",
            folder: ""
        };
        const result = await getFeedItems(feed);
        expect(result.items.length).toEqual(3);
        expect(result.title).toEqual("wallabag — all feed");
        expect(result.image).toEqual("https://wallabag.joethei.de/favicon.ico");
        expect(result.items[0].title).toEqual("Using Obsidian For Writing Fiction &amp; Notes » Eleanor Konik");

    });
    test('fake', async () => {
        const feed: RssFeed = {
            name: "Wallabag",
            url: "./wallabag.xml",
            folder: ""
        };

        const result = await getFeedItems(feed);
        expect(result.items.length).toEqual(3);
    })
});
