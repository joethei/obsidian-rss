import sortBy from "lodash.sortby";
import groupBy from "lodash.groupby";
import {ButtonComponent, Notice, Setting} from "obsidian";
import {FeedModal} from "../modals/FeedModal";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";


export function displayFeedSettings(plugin: RssReaderPlugin, container: HTMLElement) : void {

    container.empty();

    container.createEl("h3", {text: t("feeds")});

    new Setting(container)
        .setName(t("add_new"))
        .setDesc(t("add_new_feed"))
        .addButton((button: ButtonComponent): ButtonComponent => {
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
                            const oldFeed = feed;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    const feeds = plugin.settings.feeds;
                                    feeds.remove(oldFeed);
                                    feeds.push({name: modal.name, url: modal.url, folder: modal.folder});
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
