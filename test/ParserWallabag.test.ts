import {RssFeed} from "../src/settings/settings";
import {getFeedItems} from "../src/parser/rssParser";


describe('test', () => {
    test('', () => {
        const feed: RssFeed = {
            name: "Wallabag",
            url: "https://wallabag.joethei.de/feed/testUser/vPKtC7bLgxvUmkF/all",
            folder: ""
        };

        getFeedItems(feed).then(result => {
           expect(result.items.length).toEqual(3);
        }).catch(error => {
           console.error(error);
        });

    });
});
