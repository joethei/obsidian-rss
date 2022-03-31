import {RssFeed} from "../settings/settings";

export async function loadFeedsFromString(importData: string, defaultFolder: string): Promise<RssFeed[]> {
    const rawData = new window.DOMParser().parseFromString(importData, "text/xml");
    const feeds: RssFeed[] = [];


    const outlines = rawData.getElementsByTagName('outline');

    for (let i = 0, max = outlines.length; i < max; i++) {

        const current = outlines[i];
        if (!current.hasChildNodes()) {

            const title = current.getAttribute("title");
            const xmlUrl = current.getAttribute('xmlUrl');

            if(current.parentElement.hasAttribute("title")) {
                feeds.push({
                    name: title,
                    url: xmlUrl,
                    folder: defaultFolder + ((defaultFolder) ? "/" : "") + current.parentElement.getAttribute("title"),
                });
            }else {
                feeds.push({
                    name: title,
                    url: xmlUrl,
                    folder: defaultFolder + ""
                });
            }
        }
    }

    return feeds;
}
