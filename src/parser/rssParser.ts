import {request} from "obsidian";
import {RssFeed} from "../settings/settings";

/**
 * parser for .rss files, build from scratch
 * because I could not find a parser that works on mobile and is up to date.
 */

export interface RssFeedContent {
    subtitle: string,
    title: string,
    name: string,
    link: string,
    image: string,
    folder: string,
    description: string,
    items: RssFeedItem[]
}

export interface RssFeedItem {
    title: string,
    description: string,
    content: string,
    category: string,
    link: string,
    creator: string,
    pubDate: string,
    folder: string,
    feed: string,
    favorite: boolean,
    read: boolean,
    created: boolean,
    tags: string[]
}

export interface RssFeedMap {
    feed: RssFeed,
    content: RssFeedContent
}

/**
 * : to get namespaced element
 * . to get nested element
 * @param element
 * @param name
 */
function getElementByName(element: Element | Document, name: string): ChildNode {
    let value: ChildNode;
    if (typeof element.getElementsByTagName !== 'function') {
        return;
    }

    if (name.contains(":")) {
        const [namespace, tag] = name.split(":");
        const namespaceUri = element.lookupNamespaceURI(namespace);
        if (element.getElementsByTagNameNS(namespaceUri, tag).length > 0) {
            value = element.getElementsByTagNameNS(namespaceUri, tag)[0].childNodes[0];
        }

    } else if (name.contains(".")) {
        const [prefix, tag] = name.split(".");
        if (element.getElementsByTagName(prefix).length > 0) {
            const nodes = Array.from(element.getElementsByTagName(prefix)[0].childNodes);

            nodes.forEach((node) => {
                if (node.nodeName == tag) {
                    value = node;
                }
            });
        }

    } else {
        if (element.getElementsByTagName(name).length > 0) {
            if (element.getElementsByTagName(name)[0].childNodes.length == 0) {
                value = element.getElementsByTagName(name)[0];
            } else {
                const node = element.getElementsByTagName(name)[0].childNodes[0];
                if (node !== undefined)
                    value = node;
            }
        }
    }
    return value;
}

/**
 * # to get attribute
 * @param element
 * @param names possible names
 */
function getContent(element: Element | Document, names: string[]): string {
    let value: string;
    names.forEach((name) => {
        if (name.contains("#")) {
            const [elementName, attr] = name.split("#");
            const data = getElementByName(element, elementName);
            if (data) {
                if (data.nodeName == elementName) {
                    //@ts-ignore
                    value = data.getAttr(attr);
                }
            }
        }

        const data = getElementByName(element, name);
        if (data) {
            //@ts-ignore
            if (data.nodeValue) {
                value = data.nodeValue;
            }
            //@ts-ignore
            if (data.innerHTML) {
                //@ts-ignore
                value = data.innerHTML;
            }
        }

    });
    if(value === undefined) {
        return "";
    }
    return value;
}

function buildItem(element: Element): RssFeedItem {
    return {
        title: getContent(element, ["title"]),
        description: getContent(element, ["description"]),
        content: getContent(element, ["description", "content", "content:encoded", "summary"]),
        category: getContent(element, ["category"]),
        link: getContent(element, ["link", "link#href"]),
        creator: getContent(element, ["creator", "dc:creator", "author", "author.name"]),
        pubDate: getContent(element, ["pubDate", "published", "updated", "dc:date"]),
        folder: null,
        feed: null,
        read: null,
        favorite: null,
        created: null,
        tags: [],
    }
}

function getAllItems(doc: Document): Element[] {
    const items: Element[] = [];

    if (doc.getElementsByTagName("item")) {
        for (const elementsByTagNameKey in doc.getElementsByTagName("item")) {
            const entry = doc.getElementsByTagName("item")[elementsByTagNameKey];
            items.push(entry);

        }
    }
    if (doc.getElementsByTagName("entry")) {
        for (const elementsByTagNameKey in doc.getElementsByTagName("entry")) {
            const entry = doc.getElementsByTagName("entry")[elementsByTagNameKey];
            items.push(entry);
        }
    }
    return items;
}

export async function getFeedItems(feed: RssFeed): Promise<RssFeedContent> {
    const rawData = await request({url: feed.url});
    const data = new window.DOMParser().parseFromString(rawData, "text/xml");

    const items: RssFeedItem[] = [];
    const rawItems = getAllItems(data);

    rawItems.forEach((rawItem) => {
        const item = buildItem(rawItem);
        if (item.title !== undefined && item.title.length !== 0) {
            item.folder = feed.folder;
            item.feed = feed.name;
            item.read = false;
            item.favorite = false;
            item.created = false;
            items.push(item);
        }

    })

    const image = getContent(data, ["image", "image.url", "icon"]);

    const content: RssFeedContent = {
        title: getContent(data, ["title"]),
        subtitle: getContent(data, ["subtitle"]),
        link: getContent(data, ["link"]),
        //we don't want any leading or trailing slashes in image urls(i.e. reddit does that)
        image: image ? image.replace(/^\/|\/$/g, '') : null,
        description: getContent(data, ["description"]),
        items: items,
        folder: feed.folder,
        name: feed.name
    };

    return Promise.resolve(content);
}
