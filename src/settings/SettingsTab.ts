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
import {displayHotkeys} from "./HotkeySettings";

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

        const templateDesc = new DocumentFragment();
        templateDesc.createDiv().innerHTML = t("template_new_help") + "<br>" + t("available_variables") + `<br>` +
            `<strong>{{title}}</strong> → Title <br>` +
            `<strong>{{link}}</strong> → Link to article<br>` +
            `<strong>{{author}}</strong> → Author of article<br>` +
            `<strong>{{published}}</strong> → Date published<br>` +
            `<strong>{{created}}</strong> → Note creation date<br>` +
            `<strong>{{description}}</strong> → Short article description<br>` +
            `<strong>{{content}}</strong> → article content<br>` +
            `<strong>{{folder}}</strong> → Folder of feed<br>` +
            `<strong>{{feed}}</strong> → Title of feed<br>` +
            `<strong>{{filename}}</strong> → Filename<br>` +
            `<strong>{{tags}}</strong> → Tags split by comma<br>` +
            `<strong>{{media}}</strong> → Link to video/audio file`;

        new Setting(containerEl)
            .setName(t("template_new"))
            .setDesc(templateDesc)
            .addTextArea((textArea: TextAreaComponent) => {
                textArea
                    .setValue(this.plugin.settings.template)
                    .setPlaceholder(DEFAULT_SETTINGS.template)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            template: value
                        }));
                    });
                textArea.inputEl.setAttr("rows", 15);
                textArea.inputEl.setAttr("cols", 50);
            });

        const pasteTemplateDesc = new DocumentFragment();
        pasteTemplateDesc.createDiv().innerHTML = t("template_new_help") + "<br>" + t("available_variables") + `<br>` +
            `<strong>{{title}}</strong> → Title <br>` +
            `<strong>{{link}}</strong> → Link to article<br>` +
            `<strong>{{author}}</strong> → Author of article<br>` +
            `<strong>{{published}}</strong> → Date published<br>` +
            `<strong>{{created}}</strong> → Note creation date<br>` +
            `<strong>{{description}}</strong> → Short article description<br>` +
            `<strong>{{content}}</strong> → article content<br>` +
            `<strong>{{folder}}</strong> → Folder of feed<br>` +
            `<strong>{{feed}}</strong> → Title of feed<br>` +
            `<strong>{{tags}}</strong> → Tags split by comma<br>` +
            `<strong>{{media}}</strong> → Link to video/audio file`;

        new Setting(containerEl)
            .setName(t("template_paste"))
            .setDesc(pasteTemplateDesc)
            .addTextArea((textArea: TextAreaComponent) => {
                textArea
                    .setValue(this.plugin.settings.pasteTemplate)
                    .setPlaceholder(DEFAULT_SETTINGS.pasteTemplate)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            pasteTemplate: value
                        }));
                    });
                textArea.inputEl.setAttr("rows", 15);
                textArea.inputEl.setAttr("cols", 50);
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
                    .onChange(async (value) => {
                        if (value.length > 0) {
                            await this.plugin.writeSettings(() => ({
                                defaultFilename: value
                            }));
                        } else {
                            new Notice(t("fix_errors"));
                        }
                    });
            });

        containerEl.createEl("hr", {attr: {style: "border-top: 5px solid var(--background-modifier-border);"}});
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

        containerEl.createEl("hr", {attr: {style: "border-top: 5px solid var(--background-modifier-border);"}});
        containerEl.createEl("h3", {text: t("filtered_folders")});

        new Setting(containerEl)
            .setName(t("add_new"))
            .setDesc(t("add_new_filter"))
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip(t("add_new_filter"))
                    .setIcon("feather-plus")
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
                                            sortOrder: modal.sortOrder,
                                            filterFeeds: modal.filterFeeds,
                                            filterFolders: modal.filterFolders,
                                            filterTags: modal.filterTags,
                                            favorites: modal.favorites,
                                            read: modal.read,
                                            unread: modal.unread,
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

            const description: string[] = [];
            if (filter.read)
                description.push(t("read"));
            if (filter.unread)
                description.push(t("unread"));
            if (filter.favorites)
                description.push(t("favorites"));

            let message = "";
            if (filter.filterFolders.length > 0) {
                const folders = filter.filterFolders.join(",");
                message += "; " + t("from_folders") + folders;
            }
            if (filter.filterFeeds.length > 0) {
                const feeds = filter.filterFeeds.join(",");
                message += "; " + t("from_feeds") + feeds;
            }
            if (filter.filterTags.length > 0) {
                const tags = filter.filterTags.join(",");
                message += "; " + t("with_tags") + tags;
            }

            setting.setDesc(description.join(",") + message);


            setting
                .addExtraButton((b) => {
                    b.setIcon("feather-edit")
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
                                        sortOrder: modal.sortOrder,
                                        filterFeeds: modal.filterFeeds,
                                        filterFolders: modal.filterFolders,
                                        filterTags: modal.filterTags,
                                        favorites: modal.favorites,
                                        read: modal.read,
                                        unread: modal.unread,
                                    });
                                    await this.plugin.writeFiltered(() => (filters));
                                    this.display();
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("feather-trash")
                        .setTooltip(t("delete"))
                        .onClick(async () => {
                            const filters = this.plugin.settings.filtered;
                            filters.remove(filter);
                            await this.plugin.writeFiltered(() => (filters));
                            this.display();
                        });
                });

        }

        containerEl.createEl("hr", {attr: {style: "border-top: 5px solid var(--background-modifier-border);"}});

        const feedsContainer = containerEl.createDiv(
            "feed-container"
        );
        displayFeedSettings(this.plugin, feedsContainer);

        containerEl.createEl("hr", {attr: {style: "border-top: 5px solid var(--background-modifier-border);"}});

        const hotkeyContainer = containerEl.createDiv("hotkey-container");
        displayHotkeys(this.plugin, hotkeyContainer);
    }
}
