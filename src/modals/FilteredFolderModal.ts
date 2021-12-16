import {DropdownComponent, FuzzySuggestModal, Notice, SearchComponent, Setting, TextComponent} from "obsidian";
import RssReaderPlugin from "../main";
import {BaseModal} from "./BaseModal";
import t from "../l10n/locale";
import {ArraySuggest} from "../view/ArraySuggest";
import {get} from "svelte/store";
import {folderStore, tagsStore} from "../stores";
import {NUMBER_REGEX, TAG_REGEX} from "../consts";

export enum FilterType {
    UNREAD,
    READ,
    FAVORITES
}

export enum SortOrder {
    DATE_NEWEST,
    DATE_OLDEST,
    ALPHABET_NORMAL,
    ALPHABET_INVERTED
}

export interface FilteredFolder{
    name: string;
    filterTags: string[];
    filterFolders: string[];
    filterFeeds: string[];
    sortOrder: string;
    read: boolean;
    unread: boolean;
    favorites: boolean;
}

export class FilteredFolderModal extends BaseModal {
    plugin: RssReaderPlugin;

    name: string;
    filterFolders: string[] = [];
    filterTags: string[] = [];
    filterFeeds: string[] = [];
    sortOrder: string;
    read: boolean;
    unread: boolean;
    favorites: boolean;

    saved = false;

    constructor(plugin: RssReaderPlugin, folder?: FilteredFolder) {
        super(plugin.app);
        this.plugin = plugin;

        if(folder) {
            this.name = folder.name;
            this.sortOrder = folder.sortOrder;
            this.filterTags = folder.filterTags;
            this.filterFolders = folder.filterFolders;
            this.filterFeeds = folder.filterFeeds;
            this.read = folder.read;
            this.unread = folder.unread;
            this.favorites = folder.favorites;
        }
    }

    async display() : Promise<void> {
        const { contentEl } = this;

        contentEl.empty();

        let nameText: TextComponent;
        const name = new Setting(contentEl)
            .setName(t("name"))
            .setDesc(t("filter_name_help"))
            .addText((text) => {
                nameText = text;
                text.setValue(this.name)
                    .onChange((value) => {
                        this.removeValidationError(text);
                        this.name = value;
                    });
            });
        name.controlEl.addClass("rss-setting-input");

        new Setting(contentEl)
            .setName(t("only_favorites"))
            .addToggle(toggle => {
                toggle
                    .setValue(this.favorites)
                    .onChange(value => {
                        this.favorites = value;
                    });
            });

        new Setting(contentEl)
            .setName(t("show_read"))
            .addToggle(toggle => {
                toggle
                    .setValue(this.read)
                    .onChange(value => {
                        this.read = value;
                    });
            });

        new Setting(contentEl)
            .setName(t("show_unread"))
            .addToggle(toggle => {
                toggle
                    .setValue(this.unread)
                    .onChange(value => {
                        this.unread = value;
                    });
            });

        const sorting = new Setting(contentEl)
            .setName(t("sort"))
            .addDropdown((dropdown: DropdownComponent) => {
                for(const order in SortOrder) {
                    if(order.length > 1) {
                        // @ts-ignore
                        dropdown.addOption(order, t("sort_" + order.toLowerCase()));
                    }
                }

                dropdown
                    .setValue(this.sortOrder)
                    .onChange(async (value: string) => {
                        this.sortOrder = value;
                    });
            });
        sorting.controlEl.addClass("rss-setting-input");

        //folders
        const foldersDiv = contentEl.createDiv("folders");
        foldersDiv.createEl("h2", {text: t("folders")});
        foldersDiv.createEl("p", {text: t("filter_folder_help")});

        for (const folder in this.filterFolders) {
            new Setting(foldersDiv)
                .addSearch(async (search: SearchComponent) => {
                    new ArraySuggest(this.app, search.inputEl, get(folderStore));
                    search
                        .setValue(this.filterFolders[folder])
                        .onChange(async (value: string) => {
                            this.removeValidationError(search);
                            this.filterFolders = this.filterFolders.filter(e => e !== this.filterFolders[folder]);
                            this.filterFolders.push(value);
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setTooltip(t("delete"))
                        .setIcon("feather-trash")
                        .onClick(() => {
                            this.filterFolders = this.filterFolders.filter(e => e !== this.filterFolders[folder]);
                            this.display();
                        });

                });
        }

        let folderValue = "";
        const newFolder = new Setting(foldersDiv)
            .addSearch(async (search: SearchComponent) => {
                new ArraySuggest(this.app, search.inputEl, get(folderStore));
                search
                    .onChange(async (value: string) => {
                        folderValue = value;
                    });
            }).addExtraButton(button => {
                button
                    .setTooltip(t("add"))
                    .setIcon("feather-plus")
                    .onClick(() => {
                        this.filterFolders.push(folderValue);
                        this.display();
                    });
            });
        newFolder.controlEl.addClass("rss-setting-input");


        //feeds
        const feedsDiv = contentEl.createDiv("feeds");
        feedsDiv.createEl("h2", {text: t("feeds")});
        feedsDiv.createEl("p", {text: t("filter_feed_help")});

        const feeds = this.plugin.settings.feeds.filter(feed => {
            if(this.filterFolders.length === 0)
                return true;
            return this.filterFolders.contains(feed.folder);
        }).map((feed) => feed.name);

        for (const feed in this.filterFeeds) {
            new Setting(feedsDiv)
                .addSearch(async (search: SearchComponent) => {
                    new ArraySuggest(this.app, search.inputEl, new Set(feeds));
                    search
                        .setValue(this.filterFeeds[feed])
                        .onChange(async (value: string) => {
                            this.removeValidationError(search);
                            this.filterFeeds = this.filterFeeds.filter(e => e !== this.filterFeeds[feed]);
                            this.filterFeeds.push(value);
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setTooltip(t("delete"))
                        .setIcon("feather-trash")
                        .onClick(() => {
                            this.filterFeeds = this.filterFeeds.filter(e => e !== this.filterFeeds[feed]);
                            this.display();
                        });

                });
        }

        let feedValue = "";
        const newFeed = new Setting(feedsDiv)
            .addSearch(async (search: SearchComponent) => {
                new ArraySuggest(this.app, search.inputEl, new Set(feeds));
                search
                    .onChange(async (value: string) => {
                        feedValue = value;
                    });
            }).addExtraButton(button => {
                button
                    .setTooltip(t("add"))
                    .setIcon("feather-plus")
                    .onClick(() => {
                        this.filterFeeds.push(feedValue);
                        this.display();
                    });
            });
        newFeed.controlEl.addClass("rss-setting-input");

        //tags
        const tagDiv = contentEl.createDiv("tags");
        tagDiv.createEl("h2", {text: t("tags")});
        tagDiv.createEl("p", {text: t("filter_tags_help")});

        for (const tag in this.filterTags) {
            new Setting(tagDiv)
                .addSearch(async (search: SearchComponent) => {
                    new ArraySuggest(this.app, search.inputEl, get(tagsStore));
                    search
                        .setValue(this.filterTags[tag])
                        .onChange(async (value: string) => {
                            this.removeValidationError(search);
                            if (!value.match(TAG_REGEX) || value.match(NUMBER_REGEX) || value.contains(" ") || value.contains('#')) {
                                this.setValidationError(search, t("invalid_tag"));
                                return;
                            }
                            this.filterTags = this.filterTags.filter(e => e !== this.filterTags[tag]);
                            this.filterTags.push(value);
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setTooltip(t("delete"))
                        .setIcon("feather-trash")
                        .onClick(() => {
                            this.filterTags = this.filterTags.filter(e => e !== this.filterTags[tag]);
                            this.display();
                        });

                });
        }

        let tagValue = "";
        let tagComponent: SearchComponent;
        const newTag = new Setting(tagDiv)
            .addSearch(async (search: SearchComponent) => {
                tagComponent = search;
                new ArraySuggest(this.app, search.inputEl, get(tagsStore));
                search
                    .onChange(async (value: string) => {
                        if (!value.match(TAG_REGEX) || value.match(NUMBER_REGEX) || value.contains(" ") || value.contains('#')) {
                            this.setValidationError(search, t("invalid_tag"));
                            return;
                        }
                        tagValue = value;
                    });
            }).addExtraButton(button => {
                button
                    .setTooltip(t("add"))
                    .setIcon("feather-plus")
                    .onClick(() => {
                        if (!tagValue.match(TAG_REGEX) || tagValue.match(NUMBER_REGEX) || tagValue.contains(" ") || tagValue.contains('#')) {
                            this.setValidationError(tagComponent, t("invalid_tag"));
                            return;
                        }
                        this.filterTags.push(tagValue);
                        this.display();
                    });
            });
        newTag.controlEl.addClass("rss-setting-input");

        const footerEl = contentEl.createDiv();
        const footerButtons = new Setting(footerEl);
        footerButtons.addButton((b) => {
            b.setTooltip(t("save"))
                .setIcon("checkmark")
                .onClick(async () => {
                    let error = false;
                    if(!nameText.getValue().length) {
                        this.setValidationError(nameText, t("invalid_name"));
                        error = true;
                    }

                    if(error) {
                        new Notice(t("fix_errors"));
                        return;
                    }
                    this.saved = true;
                    this.close();
                });
            return b;
        });
        footerButtons.addExtraButton((b) => {
            b.setIcon("cross")
                .setTooltip(t("cancel"))
                .onClick(() => {
                    this.saved = false;
                    this.close();
                });
            return b;
        });
    }

    async onOpen() : Promise<void> {
        await this.display();
    }
}
