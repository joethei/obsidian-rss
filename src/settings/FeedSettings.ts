import sortBy from "lodash.sortby";
import groupBy from "lodash.groupby";
import {ButtonComponent, Notice, Setting} from "obsidian";
import {FeedModal} from "../modals/FeedModal";
import RssReaderPlugin from "../main";


export function displayFeedSettings(plugin: RssReaderPlugin, container: HTMLElement) : void {

    container.empty();

    container.createEl("h3", {text: "Feeds"});

    new Setting(container)
        .setName("Add New")
        .setDesc("Add a new Feed")
        .addButton((button: ButtonComponent): ButtonComponent => {
            return button
                .setTooltip("add new Feed")
                .setIcon("create-new")
                .onClick(async () => {
                    const modal = new FeedModal(plugin);

                    modal.onClose = async () => {
                        if (modal.saved) {
                            if (plugin.settings.feeds.some(item => item.url === modal.url)) {
                                new Notice("you already have a feed configured with that url");
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

            setting.setName((feed.folder ? feed.folder : "No Folder") + " - " + feed.name);
            setting.setDesc(feed.url);

            setting
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip("Edit")
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
                    b.setIcon("trash")
                        .setTooltip("Delete")
                        .onClick(async () => {
                            const feeds = plugin.settings.feeds;
                            feeds.remove(feed);
                            await plugin.writeFeeds(() => (feeds));
                            displayFeedSettings(plugin, container);
                        });
                });
        }

    }
}
