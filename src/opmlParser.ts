import {RssFeed} from "./settings";

export async function loadFeedsFromString(importData: string) : Promise<RssFeed[]> {
    let rawData = new window.DOMParser().parseFromString(importData, "text/xml");
    const feeds: RssFeed[] = [];

    for (let elementsByTagNameKey in rawData.getElementsByTagName("body")) {
        const data = rawData.getElementsByTagName("body")[elementsByTagNameKey];
        if(typeof data !== "object") break;

        for (let elementsByTagNameKey in data.getElementsByTagName("outline")) {
            const parentElement = data.getElementsByTagName("outline")[elementsByTagNameKey];
            if(typeof parentElement !== "object") break;

            const parentTitle = parentElement.getAttr("title");

            //if there are child elements(eg. parent is a folder)
            if(parentElement.getElementsByTagName("outline").length > 0) {
                for (let elementsByTagNameKey in parentElement.getElementsByTagName("outline")) {
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
