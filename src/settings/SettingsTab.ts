import {
    App,
    ButtonComponent,
    DropdownComponent,
    MomentFormatComponent,
    Notice,
    PluginSettingTab,
    SearchComponent,
    Setting,
    TextAreaComponent,
    TextComponent,
    ToggleComponent
} from "obsidian";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";
import {FolderSuggest} from "./FolderSuggestor";
import {FilteredFolderModal} from "../modals/FilteredFolderModal";
import {displayFeedSettings} from "./FeedSettings";
import {DEFAULT_SETTINGS} from "./settings";

export class RSSReaderSettingsTab extends PluginSettingTab {
    plugin: RssReaderPlugin;

    constructor(app: App, plugin: RssReaderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: t("RSS_Reader") + " " + t("settings")});

        containerEl.createEl('h3', {text: t("file_creation")});

        new Setting(containerEl)
            .setName(t("template_new"))
            .setDesc(t("template_new_help") + ' ' +
                t("available_variables") + ' {{title}}, {{link}}, {{author}}, {{published}}, {{created}}, {{content}}, {{description}}, {{folder}}, {{feed}}, {{filename}, {{tags}}, {{#tags}}, {{media}}')
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
            .setName(t("template_paste"))
            .setDesc(t("template_paste_help") + ' ' +
                t("available_variables") + '{{title}}, {{link}}, {{author}}, {{published}}, {{content}}, {{description}}, {{folder}}, {{feed}}, {{tags}}, {{#tags}}, {{media}}')
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
            .setName(t("file_location"))
            .setDesc(t("file_location_help"))
            .addDropdown(async (dropdown: DropdownComponent) => {
                dropdown
                    .addOption("default", t("file_location_default"))
                    .addOption("custom", t("file_location_custom"))
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
                .setName(t("file_location_folder"))
                .setDesc(t("file_location_folder_help"))
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
            .setName(t("date_format"))
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
        referenceLink.setText(t("syntax_reference"));
        const text = dateFormat.descEl.createDiv("text");
        text.setText(t("syntax_looks"));
        const sampleEl = text.createSpan("sample");
        dateFormatSampleEl.setSampleEl(sampleEl);
        dateFormat.addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(t("reset"))
                .onClick(async () => {
                    await this.plugin.writeSettings(() => ({
                        dateFormat: DEFAULT_SETTINGS.dateFormat
                    }));
                    this.display();
                });
        });

        new Setting(containerEl)
            .setName(t("ask_filename"))
            .setDesc(t("ask_filename_help"))
            .addToggle((toggle: ToggleComponent) => {
                toggle
                    .setValue(this.plugin.settings.askForFilename)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            askForFilename: value
                        }));
                    });
            });

        new Setting(containerEl)
            .setName(t("default_filename"))
            .setDesc(t("default_filename_help"))
            .addText((text) => {
                text
                    .setPlaceholder(DEFAULT_SETTINGS.defaultFilename)
                    .setValue(this.plugin.settings.defaultFilename)
                    .onChange(async(value) => {
                       if(value.length > 0) {
                           await this.plugin.writeSettings(() => ({
                               defaultFilename: value
                           }));
                       } else {
                           new Notice(t("fix_errors"));
                       }
                    });
            });


        containerEl.createEl("h3", {text: "Misc"});

        const refresh = new Setting(containerEl)
            .setName(t("refresh_time"))
            .setDesc(t("refresh_time_help"))
            .addText((text: TextComponent) => {
                text
                    .setPlaceholder(String(DEFAULT_SETTINGS.updateTime))
                    .setValue(String(this.plugin.settings.updateTime))
                    .onChange(async (value) => {
                        if (value.length === 0) {
                            new Notice(t("specify_positive_number"));
                            return;
                        }
                        if (Number(value) < 0) {
                            new Notice(t("specify_positive_number"));
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
            .setName(t("multi_device_usage"))
            .setDesc(t("multi_device_usage_help"))
            .addToggle((toggle: ToggleComponent) => {
                return toggle
                    .setValue(this.plugin.settings.autoSync)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            autoSync: value
                        }));
                    });
            });

        containerEl.createEl("h3", {text: t("filtered_folders")});

        new Setting(containerEl)
            .setName(t("add_new"))
            .setDesc(t("add_new_filter"))
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip(t("add_new_filter"))
                    .setIcon("create-new")
                    .onClick(async () => {
                        const modal = new FilteredFolderModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                if (this.plugin.settings.filtered.some(folder => folder.name === modal.name)) {
                                    new Notice(t("filter_exists"));
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
        for (const id in this.plugin.settings.filtered.sort((a, b) => a.name.localeCompare(b.name))) {
            const filter = this.plugin.settings.filtered[id];
            const setting = new Setting(filtersDiv);

            setting.setName(filter.name);
            setting.setDesc(filter.filterType + (filter.filterContent.length > 0) ? filter.filterContent : "");

            setting
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip(t("edit"))
                        .onClick(() => {
                            const modal = new FilteredFolderModal(this.plugin, filter);
                            const oldFilter = filter;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    const filters = this.plugin.settings.filtered;
                                    filters.remove(oldFilter);
                                    filters.push({
                                        name: modal.name,
                                        filterType: modal.filterType,
                                        filterContent: modal.filterContent,
                                        sortOrder: modal.sortOrder
                                    });
                                    await this.plugin.writeFiltered(() => (filters));
                                    this.display();
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash")
                        .setTooltip(t("delete"))
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

        containerEl.createEl("h2", {text: t("hotkeys")});
        containerEl.createEl("h3", {text: t("hotkeys_reading")});


        new Setting(containerEl)
            .setName(t("create_note"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.create)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.create)
                    .onChange(async (value) => {
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
            .setName(t("paste_to_note"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.paste)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.paste)
                    .onChange(async (value) => {
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
            .setName(t("open_browser"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.open)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.open)
                    .onChange(async (value) => {
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
            .setName(t("copy_to_clipboard"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.copy)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.copy)
                    .onChange(async (value) => {
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
            .setName(t("mark_as_favorite_remove"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.favorite)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.favorite)
                    .onChange(async (value) => {
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
            .setName(t("mark_as_read_unread"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.read)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.read)
                    .onChange(async (value) => {
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
            .setName(t("edit_tags"))
            .addText((text) => {
                text
                    .setValue(this.plugin.settings.hotkeys.tags)
                    .setPlaceholder(DEFAULT_SETTINGS.hotkeys.tags)
                    .onChange(async (value) => {
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
        if (this.app.plugins.plugins["obsidian-tts"]) {
            new Setting(containerEl)
                .setName(t("read_article_tts"))
                .addText((text) => {
                    text
                        .setValue(this.plugin.settings.hotkeys.tts)
                        .setPlaceholder(DEFAULT_SETTINGS.hotkeys.tts)
                        .onChange(async (value) => {
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
