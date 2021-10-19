import {request} from "obsidian";
import {RssFeed} from "./settings";

export interface RssFeedContent {
    subtitle: string;
    title: string;
    link: string;
    image: string;
    description: string;
    items: RssFeedItem[];
}

export interface RssFeedItem {
    title: string,
    description: string,
    content: string,
    category: string,
    link: string,
    creator: string,
    pubDate: string
}

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
    return value;
}

function buildItem(element: Element): RssFeedItem {
    return {
        title: getContent(element, ["title"]),
        description: getContent(element, ["description"]),
        content: getContent(element, ["description", "content", "content:encoded"]),
        category: getContent(element, ["category"]),
        link: getContent(element, ["link", "link#href"]),
        creator: getContent(element, ["creator", "dc:creator", "author", "author.name"]),
        pubDate: getContent(element, ["pubDate", "published"])
    }
}

export async function getFeedItems(feed: RssFeed): Promise<RssFeedContent> {
    const rawData = await request({url: feed.url});
    let data = new window.DOMParser().parseFromString(rawData, "text/xml");

    console.log(data);

    const items: RssFeedItem[] = [];

    if (data.getElementsByTagName("item")) {
        for (let elementsByTagNameKey in data.getElementsByTagName("item")) {
            const entry = data.getElementsByTagName("item")[elementsByTagNameKey];
            const item = buildItem(entry);
            if (item.title !== undefined)
                items.push(item);
        }
    }

    if (data.getElementsByTagName("entry")) {
        for (let elementsByTagNameKey in data.getElementsByTagName("entry")) {
            const entry = data.getElementsByTagName("entry")[elementsByTagNameKey];
            const item = buildItem(entry);
            if (item.title !== undefined)
                items.push(item);
        }
    }

    const image = getContent(data, ["image", "image.url", "icon"]);

    const content: RssFeedContent = {
        title: getContent(data, ["title"]),
        subtitle: getContent(data, ["subtitle"]),
        link: getContent(data, ["link"]),
        //we don't want any leading or trailing slashes in image urls(i.e. reddit does that)
        image: image ? image.replace(/^\/|\/$/g, '') : null,
        description: getContent(data, ["description"]),
        items: items
    };

    return Promise.resolve(content);
}
