import {Notice, Setting, TextComponent, moment} from "obsidian";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";
import {ArraySuggest} from "../view/ArraySuggest";
import {get} from "svelte/store";
import {folderStore} from "../stores";
import {BaseModal} from "./BaseModal";
import {RssFeedContent} from "../parser/rssParser";
import sortBy from "lodash.sortby";
import groupBy from "lodash.groupby";

export class CleanupModal extends BaseModal {

    plugin: RssReaderPlugin;

    constructor(plugin: RssReaderPlugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    unread: boolean;
    read: boolean;
    favorite: boolean;
    tag = "";
    older_than: number;
    feed = "all-option-id";
    wrong_feed: boolean;


    async onOpen() : Promise<void> {
        const {contentEl} = this;

        contentEl.empty();

        contentEl.createEl("h1", {text: t("cleanup")});
        contentEl.createEl("p", {text: t("cleanup_help")});
        contentEl.createEl("p", {text: t("cleanup_help2")});

        new Setting(contentEl)
            .setName(t("unread"))
            .addToggle(toggle => {
                toggle.onChange((value) => {
                    this.unread = value;
                })
            });

        new Setting(contentEl)
            .setName(t("read"))
            .addToggle(toggle => {
                toggle.onChange((value) => {
                    this.read = value;
                })
            });

        new Setting(contentEl)
            .setName(t("favorite"))
            .addToggle(toggle => {
                toggle.onChange((value) => {
                    this.favorite = value;
                })
            });

        new Setting(contentEl)
            .setName(t("tag"))
            .addSearch(search => {
                const tags: string[] = [];
                for (const feed of this.plugin.settings.items) {
                    for(const item of feed.items) {
                        if(item !== undefined)
                            tags.push(...item.tags);
                    }
                }
                new ArraySuggest(this.app, search.inputEl, new Set<string>(tags));
                search
                    .onChange(async (value: string) => {
                        this.tag = value;
                    });
            });

        let older_than_setting: TextComponent;
        new Setting(contentEl)
            .setName(t("older_than"))
            .setDesc(t("older_than_help"))
            .addText(text => {
                older_than_setting = text;
                text.setPlaceholder("5")
                    .onChange(value => {
                        this.removeValidationError(text);
                        if (Number(value)) {
                            this.older_than = Number(value);
                        }
                    });

            }).controlEl.addClass("rss-setting-input");
        //we don't want decimal numbers.
        older_than_setting.inputEl.setAttr("onkeypress", "return event.charCode >= 48 && event.charCode <= 57");

        new Setting(contentEl)
            .setName(t("from_feed"))
            .addDropdown(dropdown => {
                dropdown.addOption("all-option-id", t("all"));

                const sorted = sortBy(groupBy(this.plugin.settings.feeds, "folder"), function (o) {
                    return o[0].folder;
                });
                for (const [, feeds] of Object.entries(sorted)) {
                    for (const id in feeds) {
                        const feed = feeds[id];
                        dropdown.addOption(feed.folder + "-" + feed.name, feed.folder + " - " + feed.name);
                    }
                    dropdown.setValue(this.feed);
                }
                dropdown.onChange(value => {
                    this.feed = value;
                });
            });

        const details = contentEl.createEl("details");
        const summary = details.createEl("summary");
        summary.setText(t("advanced"));
        const advanced = details.createDiv("advanced");

        new Setting(advanced)
            .setName(t("remove_wrong_feed"))
            .setDesc(t("remove_wrong_feed_help"))
            .addToggle(toggle => {
                toggle.onChange((value) => {
                    this.wrong_feed = value;
                })
            });

        new Setting(contentEl).addButton((button) => {
            button
                .setIcon("trash")
                .setTooltip(t("perform_cleanup"))
                .onClick(async () => {

                    let items: RssFeedContent[] = this.plugin.settings.items;

                    let date = moment();
                    if (this.older_than) {
                        date = moment().subtract(this.older_than, 'days');
                    }

                    let count = 0;
                    const itemsCount = items.reduce((count, current) => count + current.items.length, 0);
                    const notice = new Notice(t("scanning_items", "0", itemsCount.toString()));

                    for(const feed of items) {
                        for (const item of feed.items) {
                            if (item !== undefined) {
                                let toRemove = 0;
                                if (item.pubDate === undefined || moment(item.pubDate).isBefore(date)) {
                                    if (this.feed === "all-option-id" || this.feed === (item.folder + "-" + item.feed)) {
                                        if ((this.read && item.read) || (!this.read && !item.read) || (this.read && !item.read)) {
                                            toRemove++;
                                        }
                                        if ((this.unread && !item.read) || (!this.unread && item.read)) {
                                            toRemove++;
                                        }
                                        if ((this.favorite && item.favorite) || (!this.favorite && !item.favorite) || (this.favorite && !item.favorite)) {
                                            toRemove++;
                                        }
                                        if (this.tag === "" || item.tags.includes(this.tag)) {
                                            toRemove++;
                                        }
                                    }

                                }
                                if(toRemove == 4) {
                                    feed.items = feed.items.filter(value => value.hash !== item.hash);
                                }
                            }

                            count++;
                            notice.setMessage(t("scanning_items", count.toString(), itemsCount.toString()));
                        }
                    }

                    if (this.wrong_feed) {
                        console.log("removing invalid feeds");
                        const feeds = this.plugin.settings.feeds.map<string>((feed) => {
                            return feed.name;
                        });
                        items = items.filter((item) => {
                            return feeds.includes(item.name);
                        });

                        const folders = get(folderStore);
                        items = items.filter((item) => {
                            return folders.has(item.folder);
                        });

                        //removing all items that do not fit
                        items.forEach((feed) => {
                            feed.items = feed.items.filter((item) => {
                                return feed.name === item.feed && feed.folder === item.folder;
                            });
                        });
                    }

                    await this.plugin.writeFeedContent(() => {
                        return items;
                    });
                    this.close();

                });
        }).addExtraButton((button) => {
            button
                .setIcon("cross")
                .setTooltip(t("cancel"))
                .onClick(() => {
                    this.close();
                })
        });
    }
}
