import {RssFeed} from "./settings";

//not used currently, parser not fully implemented.
export async function loadFeedsFromString(importData: string) : Promise<RssFeed[]> {
    const rawData = new window.DOMParser().parseFromString(importData, "text/xml");
    const feeds: RssFeed[] = [];

    for (const elementsByTagNameKey in rawData.getElementsByTagName("body")) {
        const data = rawData.getElementsByTagName("body")[elementsByTagNameKey];
        if(typeof data !== "object") break;

        for (const elementsByTagNameKey in data.getElementsByTagName("outline")) {
            const parentElement = data.getElementsByTagName("outline")[elementsByTagNameKey];
            if(typeof parentElement !== "object") break;

            const parentTitle = parentElement.getAttr("title");

            //if there are child elements(eg. parent is a folder)
            if(parentElement.getElementsByTagName("outline").length > 0) {
                for (const elementsByTagNameKey in parentElement.getElementsByTagName("outline")) {
                    const childElement = data.getElementsByTagName("outline")[elementsByTagNameKey];
                    console.log(childElement);
                    if (childElement.nodeName == "outline") {
                        //@ts-ignore
                    }
                    const childTitle = childElement.getAttr("title");
                    const childUrl = childElement.getAttr("xmlUrl");

                    feeds.push({
                        name: childTitle,
                        url: childUrl,
                        folder: parentTitle
                    })
                }
            }else {
                feeds.push({
                    name: parentTitle,
                    url: parentElement.getAttr("xmlUrl"),
                    folder: ""
                });
            }
        }
    }

    return feeds;
}
