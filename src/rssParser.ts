import FeedMe, {Feed} from "feedme";
import {request} from "obsidian";
import {RssFeed} from "./settings";

export async function listFeedItems(feed: RssFeed) : Promise<Feed> {
    let parser = new FeedMe(true);
    let data = await request({url: feed.url});
    parser.write(data);
    return parser.done();
}
