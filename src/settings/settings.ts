import {
    App,
    ButtonComponent, DropdownComponent, MomentFormatComponent,
    Notice,
    PluginSettingTab, SearchComponent,
    Setting,
    TextAreaComponent,
    TextComponent
} from "obsidian";
import RssReaderPlugin from "../main";
import {FeedModal} from "../modals/FeedModal";
import groupBy from "lodash.groupby";
import {FolderSuggest} from "./FolderSuggestor";
import {FilteredFolder, FilteredFolderModal} from "../modals/FilteredFolderModal";
import {RssFeedContent} from "../parser/rssParser";

export interface RssFeed {
    name: string,
    url: string,
    folder: string,
}

export interface RssReaderSettings {
    feeds: RssFeed[],
    template: string,
    pasteTemplate: string,
    updateTime: number,
    saveLocation: string,
    saveLocationFolder: string,
    filtered: FilteredFolder[],
    items: RssFeedContent[],
    dateFormat: string,
}

export const DEFAULT_SETTINGS: RssReaderSettings = Object.freeze({
    feeds: [],
    updateTime: 60,
    filtered: [{
        name: "Favorites",
        filterType: "FAVORITES",
        filterContent: "",
        sortOrder: "ALPHABET_NORMAL"
    }],
    saveLocation: 'default',
    saveLocationFolder: '',
    items: [],
    dateFormat: "YYYY-MM-DDTHH:MM:SS",
    template: "---\n" +
        "link: {{link}}\n" +
        "author: {{author}}\n" +
        "published: {{published}}\n" +
        "---\n" +
        "{{title}}\n" +
        "{{content}}",
    pasteTemplate: "## {{title}}\n" +
        "{{content}}"
});

export class RSSReaderSettingsTab extends PluginSettingTab {
    plugin: RssReaderPlugin;

    constructor(app: App, plugin: RssReaderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'RSS Reader Settings'});

        new Setting(containerEl)
            .setName("New file template")
            .setDesc('When creating a note from a article this gets processed. ' +
                'Available variables are: {{title}}, {{link}}, {{author}}, {{published}}, {{created}}, {{content}}, {{description}}, {{folder}}, {{feed}}, {{filename}')
            .addTextArea((textArea: TextAreaComponent) => {
                textArea
                    .setValue(this.plugin.settings.template)
                    .setPlaceholder(DEFAULT_SETTINGS.template)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            template: value
                        }));
                    });
                textArea.inputEl.setAttr("rows", 8);
            });

        new Setting(containerEl)
            .setName("paste article template")
            .setDesc('When pasting/copying an article this gets processed. ' +
                'Available variables are: {{title}}, {{link}}, {{author}}, {{published}}, {{content}}, {{description}}, {{folder}}, {{feed}}')
            .addTextArea((textArea: TextAreaComponent) => {
                textArea
                    .setValue(this.plugin.settings.pasteTemplate)
                    .setPlaceholder(DEFAULT_SETTINGS.pasteTemplate)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            pasteTemplate: value
                        }));
                    });
                textArea.inputEl.setAttr("rows", 8);
            });

        new Setting(containerEl)
            .setName("Default location for new notes")
            .setDesc("")
            .addDropdown(async (dropdown: DropdownComponent) => {
                dropdown
                    .addOption("default", "In the default folder")
                    .addOption("custom", "In the folder specified below")
                    .setValue(this.plugin.settings.saveLocation)
                    .onChange(async (value: string) => {
                        await this.plugin.writeSettings(() => (
                            {saveLocation: value}
                        ));
                        this.display();
                    });
            });

        if (this.plugin.settings.saveLocation == "custom") {
            new Setting(containerEl)
                .setName("Folder to create new articles in")
                .setDesc("newly created articles will appear in this folder")
                .addSearch(async (search: SearchComponent) => {
                    new FolderSuggest(this.app, search.inputEl);
                    search
                        .setValue(this.plugin.settings.saveLocationFolder)
                        .setPlaceholder(DEFAULT_SETTINGS.saveLocationFolder)
                        .onChange(async (value: string) => {
                            await this.plugin.writeSettings(() => (
                                {saveLocationFolder: value}
                            ));
                        });
                });
        }

        const refresh = new Setting(containerEl)
            .setName("Refresh time")
            .setDesc("How often should the feeds be refreshed, in minutes, use 0 to disable")
            .addText((text: TextComponent) => {
                text
                    .setPlaceholder(String(DEFAULT_SETTINGS.updateTime))
                    .setValue(String(this.plugin.settings.updateTime))
                    .onChange(async (value) => {
                        if (value.length === 0) {
                            new Notice("please specify a value");
                            return;
                        }
                        if (Number(value) == 0) {
                            new Notice("please specify a bigger value");
                            return;
                        }

                        await this.plugin.writeSettings(() => (
                            {updateTime: Number(value)}
                        ));
                    });
                text.inputEl.setAttr("type", "number");
                text.inputEl.setAttr("min", "1");
                //we don't want decimal numbers.
                text.inputEl.setAttr("onkeypress", "return event.charCode >= 48 && event.charCode <= 57");
            });
        refresh.addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip('restore default')
                .onClick(async () => {
                    await this.plugin.writeSettings(() => ({
                        updateTime: DEFAULT_SETTINGS.updateTime
                    }));
                    this.display();
                });
        });

        let dateFormatSampleEl: MomentFormatComponent;
        const dateFormat = new Setting(containerEl)
            .setName("Date format")
            .setDesc("")
            .addMomentFormat((format: MomentFormatComponent) => {
                dateFormatSampleEl = format
                    .setDefaultFormat(DEFAULT_SETTINGS.dateFormat)
                    .setPlaceholder(DEFAULT_SETTINGS.dateFormat)
                    .setValue(this.plugin.settings.dateFormat)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => (
                            {dateFormat: value}
                        ));
                    });
            });
        const referenceLink = dateFormat.descEl.createEl("a");
        referenceLink.setAttr("href", "https://momentjs.com/docs/#/displaying/format/");
        referenceLink.setText("Syntax Reference");
        const text = dateFormat.descEl.createDiv("text");
        text.setText("Your current syntax looks like this: ");
        const sampleEl = text.createSpan("sample");
        dateFormatSampleEl.setSampleEl(sampleEl);
        dateFormat.addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip('restore default')
                .onClick(async () => {
                    await this.plugin.writeSettings(() => ({
                        dateFormat: DEFAULT_SETTINGS.dateFormat
                    }));
                    this.display();
                });
        });

        containerEl.createEl("h3", {text: "Filtered Folders"});

        new Setting(containerEl)
            .setName("Add New")
            .setDesc("Add new filtered folder")
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip("add new filtered folder")
                    .setIcon("create-new")
                    .onClick(async () => {
                        const modal = new FilteredFolderModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                if (this.plugin.settings.filtered.some(folder => folder.name === modal.name)) {
                                    new Notice("you already have a filter configured with that name");
                                    return;
                                }
                                await this.plugin.writeFiltered(() => (
                                    this.plugin.settings.filtered.concat({
                                            name: modal.name,
                                            filterType: modal.filterType,
                                            filterContent: modal.filterContent,
                                            sortOrder: modal.sortOrder
                                        }
                                    )));
                                this.display();
                            }
                        };

                        modal.open();
                    });
            });

        const filterContainer = containerEl.createDiv(
            "filter-container"
        );
        const filtersDiv = filterContainer.createDiv("filters");
        for (const id in this.plugin.settings.filtered) {
            const filter = this.plugin.settings.filtered[id];
            const setting = new Setting(filtersDiv);

            setting.setName(filter.name);
            setting.setDesc(filter.filterType + (filter.filterContent.length > 0) ? (" from " + filter.filterContent) : "");

            setting
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip("Edit")
                        .onClick(() => {
                            const modal = new FilteredFolderModal(this.plugin, filter);
                            const oldFilter = filter;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    const filters = this.plugin.settings.filtered;
                                    filters.remove(oldFilter);
                                    filters.push({name: modal.name, filterType: modal.filterType, filterContent: modal.filterContent, sortOrder: modal.sortOrder});
                                    await this.plugin.writeFiltered(() => (filters));
                                    this.display();
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash")
                        .setTooltip("Delete")
                        .onClick(async () => {
                            const filters = this.plugin.settings.filtered;
                            filters.remove(filter);
                            await this.plugin.writeFiltered(() => (filters));
                            this.display();
                        });
                });

        }

        containerEl.createEl("h3", {text: "Feeds"});

        new Setting(containerEl)
            .setName("Add New")
            .setDesc("Add a new Feed")
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip("add new Feed")
                    .setIcon("create-new")
                    .onClick(async () => {
                        const modal = new FeedModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                if (this.plugin.settings.feeds.some(item => item.url === modal.url)) {
                                    new Notice("you already have a feed configured with that url");
                                    return;
                                }
                                await this.plugin.writeFeeds(() => (
                                    this.plugin.settings.feeds.concat({
                                            name: modal.name,
                                            url: modal.url,
                                            folder: modal.folder
                                        }
                                    )));
                                this.display();
                            }
                        };

                        modal.open();
                    });
            });

        const additionalContainer = containerEl.createDiv(
            "feed-container"
        );

        const feedsDiv = additionalContainer.createDiv("feeds");
        const sorted = groupBy(this.plugin.settings.feeds, "folder");
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
                                const modal = new FeedModal(this.plugin, feed);
                                const oldFeed = feed;

                                modal.onClose = async () => {
                                    if (modal.saved) {
                                        const feeds = this.plugin.settings.feeds;
                                        feeds.remove(oldFeed);
                                        feeds.push({name: modal.name, url: modal.url, folder: modal.folder});
                                        await this.plugin.writeFeeds(() => (feeds));
                                        this.display();
                                    }
                                };

                                modal.open();
                            });
                    })
                    .addExtraButton((b) => {
                        b.setIcon("trash")
                            .setTooltip("Delete")
                            .onClick(async () => {
                                const feeds = this.plugin.settings.feeds;
                                feeds.remove(feed);
                                await this.plugin.writeFeeds(() => (feeds));
                                this.display();
                            });
                    });
            }

        }
    }
}
