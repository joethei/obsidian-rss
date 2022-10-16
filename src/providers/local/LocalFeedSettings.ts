import {SettingsSection} from "../../settings/SettingsSection";
import {ButtonComponent, moment, Notice, request, Setting} from "obsidian";
import t from "../../l10n/locale";
import {FeedModal} from "../../modals/FeedModal";
import {ImportModal} from "../../modals/ImportModal";
import {generateOPML} from "../../parser/opmlExport";
import {CleanupModal} from "../../modals/CleanupModal";
import RssReaderPlugin from "../../main";
import sortBy from "lodash.sortby";
import groupBy from "lodash.groupby";
import {RssFeed} from "../../settings/settings";
import {Md5} from "ts-md5";
import {MessageModal} from "../../modals/MessageModal";
import {getFeedItems, RssFeedContent} from "../../parser/rssParser";

export class LocalFeedSettings extends SettingsSection {

    constructor(plugin: RssReaderPlugin, containerEl: HTMLDivElement) {
        super(plugin, containerEl, false);
    }

    getName(): string {
        return "";
    }

    display() {
        this.contentEl.empty();

        new Setting(this.contentEl)
            .setName(t("add_new"))
            .setDesc(t("add_new_feed"))
            .addButton((button: ButtonComponent) => {
                return button
                    .setTooltip(t("add_new_feed"))
                    .setIcon("plus")
                    .onClick(async () => {
                        const modal = new FeedModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                if (this.plugin.settings.feeds.some(item => item.url === modal.url)) {
                                    new Notice(t("feed_already_configured"));
                                    return;
                                }
                                await this.plugin.writeFeeds(() => (
                                    this.plugin.settings.feeds.concat({
                                            name: modal.name,
                                            url: modal.url,
                                            folder: modal.folder ? modal.folder : ""
                                        }
                                    )));
                                this.display();
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
                        const modal = new ImportModal(this.plugin);
                        modal.onClose = () => {
                            this.display();
                        };
                        modal.open();
                    });
            })
            .addExtraButton(async (button) => {
                button
                    .setTooltip(t("export_opml"))
                    .setIcon("upload")
                    .onClick(() => {
                        if (this.plugin.app.vault.adapter.exists("rss-feeds-export.opml")) {
                            this.plugin.app.vault.adapter.remove("rss-feeds-export.opml");
                        }
                        this.plugin.app.vault.create("rss-feeds-export.opml", generateOPML(this.plugin.settings.feeds));
                        new Notice(t("created_export"));

                    });
            })
            .addExtraButton(async (button) => {
                button
                    .setTooltip(t("perform_cleanup"))
                    .setIcon("lucide-trash")
                    .onClick(() => {
                        new CleanupModal(this.plugin).open();
                    });
            });
        const feedsDiv = this.contentEl.createDiv("feeds");
        this.displayFeedList(this.plugin, feedsDiv);
    }


    displayFeedList(plugin
                        :
                        RssReaderPlugin, container
                        :
                        HTMLElement, disabled = false
    ) {

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
                                        this.displayFeedList(plugin, container);
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
                                this.displayFeedList(plugin, container, true);

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
                                this.displayFeedList(plugin, container, false);
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

                                this.displayFeedList(plugin, container);
                            });
                    });
            }
        }
    }
}
