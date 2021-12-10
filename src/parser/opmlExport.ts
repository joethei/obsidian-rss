import {RssFeed} from "../settings/settings";
import groupBy from "lodash.groupby";

export function generateOPML(feeds: RssFeed[]) : string {
    const doc = document.implementation.createDocument("", "opml");

    const head = doc.createElement("head");
    const title = doc.createElement("title");
    head.appendChild(title);
    title.setText("Obsidian RSS Export");

    doc.documentElement.appendChild(head);
    const body = doc.createElement("body");

    doc.documentElement.appendChild(body);

    const sorted = groupBy(feeds, "folder");
    for(const id of Object.keys(sorted)) {
        const folder = sorted[id];
        const outline = doc.createElement("outline");
        body.appendChild(outline);
        outline.setAttribute("title", folder[0].folder);
        for (const feed of folder) {
            const exportFeed = doc.createElement("outline");
            exportFeed.setAttribute("title", feed.name)
            exportFeed.setAttribute("xmlUrl", feed.url);
            outline.append(exportFeed);
        }
    }

    return new XMLSerializer().serializeToString(doc.documentElement);
}
