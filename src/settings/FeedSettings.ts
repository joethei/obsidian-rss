import sortBy from "lodash.sortby";
import groupBy from "lodash.groupby";
import {ButtonComponent, moment, Notice, request, Setting} from "obsidian";
import {FeedModal} from "../modals/FeedModal";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";
import {ImportModal} from "../modals/ImportModal";
import {RssFeed} from "./settings";
import {Md5} from "ts-md5";
import {CleanupModal} from "../modals/CleanupModal";
import {generateOPML} from "../parser/opmlExport";
import {getFeedItems, RssFeedContent} from "../parser/rssParser";
import {MessageModal} from "../modals/MessageModal";


export function displayFeedSettings(plugin: RssReaderPlugin, container: HTMLElement): void {

    container.empty();

    container.createEl("h3", {text: t("feeds")});

    new Setting(container)
        .setName(t("add_new"))
        .setDesc(t("add_new_feed"))
        .addButton((button: ButtonComponent) => {
            return button
                .setTooltip(t("add_new_feed"))
                .setIcon("plus")
                .onClick(async () => {
                    const modal = new FeedModal(plugin);

                    modal.onClose = async () => {
                        if (modal.saved) {
                            if (plugin.settings.feeds.some(item => item.url === modal.url)) {
                                new Notice(t("feed_already_configured"));
                                return;
                            }
                            await plugin.writeFeeds(() => (
                                plugin.settings.feeds.concat({
                                        name: modal.name,
                                        url: modal.url,
                                        folder: modal.folder ? modal.folder : ""
                                    }
                                )));
                            displayFeedSettings(plugin, container);
                        }
                    };

                    modal.open();
                });
        })
        .addExtraButton(async (button) => {
            button
                .setTooltip(t("import_opml"))
                .setIcon("download")
                .onClick(() => {
                    const modal = new ImportModal(plugin);
                    modal.onClose = () => {
                        displayFeedSettings(plugin, container);
                    };
                    modal.open();
                });
        })
        .addExtraButton(async (button) => {
            button
                .setTooltip(t("export_opml"))
                .setIcon("upload")
                .onClick(() => {
                    if (plugin.app.vault.adapter.exists("rss-feeds-export.opml")) {
                        plugin.app.vault.adapter.remove("rss-feeds-export.opml");
                    }
                    plugin.app.vault.create("rss-feeds-export.opml", generateOPML(plugin.settings.feeds));
                    new Notice(t("created_export"));

                });
        })
        .addExtraButton(async (button) => {
            button
                .setTooltip(t("perform_cleanup"))
                .setIcon("lucide-trash")
                .onClick(() => {
                    new CleanupModal(plugin).open();
                });
        });
    const feedsDiv = container.createDiv("feeds");
    displayFeedList(plugin, feedsDiv);
}

function displayFeedList(plugin: RssReaderPlugin, container: HTMLElement, disabled = false) {

    container.empty();

    const sorted = sortBy(groupBy(plugin.settings.feeds, "folder"), function (o) {
        return o[0].folder;
    });
    for (const [, feeds] of Object.entries(sorted)) {
        for (const id in feeds) {
            const feed = feeds[id];

            const setting = new Setting(container);

            setting.setName((feed.folder ? feed.folder : t("no_folder")) + " - " + feed.name);
            setting.setDesc(feed.url);

            setting
                .addExtraButton((b) => {
                    b
                        .setDisabled(disabled)
                        .setIcon("edit")
                        .setTooltip(t("edit"))
                        .onClick(() => {
                            const modal = new FeedModal(plugin, feed);
                            const oldFeed: RssFeed = feed;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    const feeds = plugin.settings.feeds;
                                    feeds.remove(oldFeed);
                                    feeds.push({
                                        name: modal.name,
                                        url: modal.url,
                                        folder: modal.folder ? modal.folder : ""
                                    });

                                    let items = plugin.settings.items;

                                    //make sure this data is transferred to the new entry, or this will cause a lot
                                    //of chaos when renaming, like putting entries into the wrong feed.
                                    items = items.filter((content) => {
                                        return content.name === oldFeed.name && content.folder === oldFeed.folder;
                                    });
                                    items.forEach((content) => {
                                        content.name = modal.name;
                                        content.folder = modal.folder;
                                        content.hash = <string>new Md5().appendStr(modal.name).appendStr(modal.folder).end();
                                        content.items.forEach(item => {
                                            item.feed = modal.name;
                                            item.folder = modal.folder ? modal.folder : "";
                                            item.hash = <string>new Md5().appendStr(item.title).appendStr(item.folder).appendStr(item.link).end();
                                        });
                                    });
                                    await plugin.writeFeedContent(() => {
                                        return items;
                                    });

                                    await plugin.writeFeeds(() => (feeds));
                                    displayFeedList(plugin, container);
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setDisabled(disabled)
                        .setTooltip(t("from_archive"))
                        .setIcon("archive")
                        .onClick(async () => {
                            const modal = new MessageModal(plugin, t("reading_archive"));
                            modal.open();
                            displayFeedList(plugin, container, true);

                            const timemap = await request({
                                method: "GET",
                                url: "https://web.archive.org/web/timemap/link/" + feed.url
                            });
                            const items: RssFeedContent[] = [];
                            const lines = timemap.split("\n");
                            for (const line of lines) {
                                if (line.contains("memento")) {
                                    const link = line.slice(1, line.indexOf(">"));
                                    const first = link.substring(0, 41);
                                    const second = link.substring(42);
                                    items.push(await getFeedItems({
                                        name: feed.name,
                                        url: first + "id_" + second,
                                        folder: feed.folder
                                    }));
                                }
                            }

                            modal.setMessage(t("scanning_duplicates"));

                            for (const feed of plugin.settings.items) {
                                for (const content of items) {
                                    if (feed.folder === content.folder && feed.name === content.name) {
                                        const sortedItems = content.items.sort((a, b) => {
                                            return moment(b.pubDate).diff(moment(a.pubDate));
                                        });
                                        for (const item of sortedItems) {
                                            const filter = feed.items.filter((filterItem) => {
                                                return filterItem.folder === item.folder && filterItem.title === item.title;
                                            });
                                            if (filter.length === 0) {
                                                feed.items.push(item);
                                            }
                                        }
                                    }
                                }
                            }

                            await plugin.writeFeedContent(() => {
                                return plugin.settings.items;
                            });
                            displayFeedList(plugin, container, false);
                            modal.setMessage(t("refreshed_feeds"));
                            modal.close();
                        });
                })
                .addExtraButton((b) => {
                    b
                        .setDisabled(disabled)
                        .setIcon("lucide-trash")
                        .setTooltip(t("delete"))
                        .onClick(async () => {
                            const feeds = plugin.settings.feeds;
                            feeds.remove(feed);
                            await plugin.writeFeeds(() => feeds);

                            //delete wallabag.xml items from feed
                            let content = plugin.settings.items;
                            content = content.filter((content) => {
                                return content.name !== feed.name;
                            });
                            await plugin.writeFeedContent(() => content);

                            displayFeedList(plugin, container);
                        });
                });
        }
    }
}
