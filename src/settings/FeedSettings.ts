import sortBy from "lodash.sortby";
import groupBy from "lodash.groupby";
import {ButtonComponent, Notice, Setting} from "obsidian";
import {FeedModal} from "../modals/FeedModal";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";
import {ImportModal} from "../modals/ImportModal";
import {RssFeed} from "./settings";
import {Md5} from "ts-md5";
import {CleanupModal} from "../modals/CleanupModal";
import {generateOPML} from "../parser/opmlExport";


export function displayFeedSettings(plugin: RssReaderPlugin, container: HTMLElement): void {

    container.empty();

    container.createEl("h3", {text: t("feeds")});

    new Setting(container)
        .setName(t("add_new"))
        .setDesc(t("add_new_feed"))
        .addButton((button: ButtonComponent) => {
            return button
                .setTooltip(t("add_new_feed"))
                .setIcon("create-new")
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
                                        folder: modal.folder
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
                .setIcon("import-glyph")
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
                .setIcon("feather-upload")
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
                .setIcon("feather-trash")
                .onClick(() => {
                    new CleanupModal(plugin).open();
                });
        });

    const feedsDiv = container.createDiv("feeds");
    const sorted = sortBy(groupBy(plugin.settings.feeds, "folder"), function (o) {
        return o[0].folder;
    });
    for (const [, feeds] of Object.entries(sorted)) {
        for (const id in feeds) {
            const feed = feeds[id];

            const setting = new Setting(feedsDiv);

            setting.setName((feed.folder ? feed.folder : t("no_folder")) + " - " + feed.name);
            setting.setDesc(feed.url);

            setting
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip(t("edit"))
                        .onClick(() => {
                            const modal = new FeedModal(plugin, feed);
                            const oldFeed: RssFeed = feed;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    const feeds = plugin.settings.feeds;
                                    feeds.remove(oldFeed);
                                    feeds.push({name: modal.name, url: modal.url, folder: modal.folder});

                                    const items = plugin.settings.items;

                                    //make sure this data is transferred to the new entry, or this will cause a lot
                                    //of chaos when renaming, like putting entries into the wrong feed.
                                    items.filter((content) => {
                                        return content.name === oldFeed.name && content.folder === oldFeed.folder;
                                    }).forEach((content) => {
                                        content.name = modal.name;
                                        content.folder = modal.folder;
                                        content.hash = <string>new Md5().appendStr(modal.name).appendStr(modal.folder).end();
                                        content.items.forEach(item => {
                                            item.feed = modal.name;
                                            item.folder = modal.folder;
                                            item.hash = <string>new Md5().appendStr(item.title).appendStr(item.folder).appendStr(item.link).end();
                                        });
                                    });
                                    await plugin.writeFeedContent(() => {
                                        return items;
                                    });

                                    await plugin.writeFeeds(() => (feeds));
                                    displayFeedSettings(plugin, container);
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b
                        .setIcon("trash")
                        .setTooltip(t("delete"))
                        .onClick(async () => {
                            const feeds = plugin.settings.feeds;
                            feeds.remove(feed);
                            await plugin.writeFeeds(() => feeds);

                            //delete all items from feed
                            let content = plugin.settings.items;
                            content = content.filter((content) => {
                                return content.name !== feed.name;
                            });
                            await plugin.writeFeedContent(() => content);

                            displayFeedSettings(plugin, container);
                        });
                });
        }

    }
}
