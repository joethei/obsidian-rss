import {
    App,
    ButtonComponent, DropdownComponent, MomentFormatComponent,
    Notice,
    PluginSettingTab, SearchComponent,
    Setting,
    TextAreaComponent,
    TextComponent, ToggleComponent
} from "obsidian";
import RssReaderPlugin from "../main";
import {FolderSuggest} from "./FolderSuggestor";
import {FilteredFolder, FilteredFolderModal} from "../modals/FilteredFolderModal";
import {RssFeedContent} from "../parser/rssParser";
import {displayFeedSettings} from "./FeedSettings";

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
    askForFilename: boolean,
    autoSync: boolean,
    hotkeys: {
        create: string,
        paste: string,
        copy: string,
        favorite: string,
        read: string,
        tags: string,
        open: string,
        tts: string
    },
    folded: string[]
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
        "tags: [{{tags:,}}]\n" +
        "---\n" +
        "{{title}}\n" +
        "{{content}}",
    pasteTemplate: "## {{title}}\n" +
        "{{content}}",
    askForFilename: true,
    autoSync: false,
    hotkeys: {
        create: "n",
        paste: "v",
        copy: "c",
        favorite: "f",
        read: "r",
        tags: "t",
        open: "o",
        tts: "s"
    },
    folded: []
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

        containerEl.createEl('h3', {text: 'File creation'});

        new Setting(containerEl)
            .setName("New file template")
            .setDesc('When creating a note from a article this gets processed. ' +
                'Available variables are: {{title}}, {{link}}, {{author}}, {{published}}, {{created}}, {{content}}, {{description}}, {{folder}}, {{feed}}, {{filename}, {{tags}}, {{#tags}}')
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
                'Available variables are: {{title}}, {{link}}, {{author}}, {{published}}, {{content}}, {{description}}, {{folder}}, {{feed}}, {{tags}}, {{#tags}}')
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

        containerEl.createEl("h3", {text: "Misc"});

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
                        if (Number(value) < 0) {
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

        new Setting(containerEl)
            .setName("Multi device usage")
            .setDesc("Keep article status synced when using multiple devices at the same time\n(Requires a restart to become effective)")
            .addToggle((toggle: ToggleComponent) => {
                return toggle
                    .setValue(this.plugin.settings.autoSync)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            autoSync: value
                        }));
                    });
            });

        new Setting(containerEl)
            .setName("Ask for filename")
            .setDesc("Disable to use title as filename(with invalid symbols removed)")
            .addToggle((toggle: ToggleComponent) => {
                return toggle
                    .setValue(this.plugin.settings.askForFilename)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            askForFilename: value
                        }));
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
        for (const id in this.plugin.settings.filtered.sort((a,b) => a.name.localeCompare(b.name))) {
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

        const feedsContainer = containerEl.createDiv(
            "feed-container"
        );
        displayFeedSettings(this.plugin, feedsContainer);

        containerEl.createEl("h2", {text: "Hotkeys"});
        containerEl.createEl("h3", {text: "when reading a article"});


        new Setting(containerEl)
            .setName("Create new note")
            .addText((text) => {
              text
                  .setValue(this.plugin.settings.hotkeys.create)
                  .setPlaceholder(DEFAULT_SETTINGS.hotkeys.create)
                  .onChange(async(value) => {
                      await this.plugin.writeSettings(() => ({
                         hotkeys: {
                             ...this.plugin.settings.hotkeys,
                             create: value

                         }
                      }));
                  });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        new Setting(containerEl)
            .setName("Paste to current note")
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.paste)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.paste)
                    .onChange(async(value) => {
                        await this.plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                paste: value

                            }
                        }));
                    });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        new Setting(containerEl)
            .setName("Open in browser")
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.open)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.open)
                    .onChange(async(value) => {
                        await this.plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                open: value

                            }
                        }));
                    });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        new Setting(containerEl)
            .setName("Copy to clipboard")
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.copy)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.copy)
                    .onChange(async(value) => {
                        await this.plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                copy: value

                            }
                        }));
                    });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        new Setting(containerEl)
            .setName("Mark as favorites/remove from favorites")
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.favorite)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.favorite)
                    .onChange(async(value) => {
                        await this.plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                favorite: value

                            }
                        }));
                    });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        new Setting(containerEl)
            .setName("Mark as read/unread")
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.read)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.read)
                    .onChange(async(value) => {
                        await this.plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                read: value

                            }
                        }));
                    });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        new Setting(containerEl)
            .setName("Edit tags")
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.tags)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.tags)
                    .onChange(async(value) => {
                        await this.plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                tags: value

                            }
                        }));
                    });
                text.inputEl.setAttr("maxlength", 1);
                text.inputEl.style.width = "20%";
            });

        //@ts-ignore
        if(this.app.plugins.plugins["obsidian-tts"]) {
            new Setting(containerEl)
                .setName("Text to Speech")
                .addText((text) => {
                    text
                        .setValue(this.plugin.settings.hotkeys.tts)
                        .setPlaceholder(DEFAULT_SETTINGS.hotkeys.tts)
                        .onChange(async(value) => {
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    tts: value

                                }
                            }));
                        });
                    text.inputEl.setAttr("maxlength", 1);
                    text.inputEl.style.width = "20%";
                });
        }
    }
}
