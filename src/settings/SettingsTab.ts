import {
    App,
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
import {displayFeedSettings} from "./FeedSettings";
import {DEFAULT_SETTINGS} from "./settings";
import {displayHotkeys} from "./HotkeySettings";
import {displayFilterSettings} from "./FilterSettings";
import {FeedProvider} from "../providers/FeedProvider";

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
            `<strong>{{title}}</strong> → ${t("article_title")}<br>` +
            `<strong>{{link}}</strong> → ${t("article_link")}<br>` +
            `<strong>{{author}}</strong> → ${t("article_author")}<br>` +
            `<strong>{{published}}</strong> → ${t("article_published")}<br>` +
            `<strong>{{created}}</strong> → ${t("note_created")}<br>` +
            `<strong>{{description}}</strong> → ${t("article_description")}<br>` +
            `<strong>{{content}}</strong> → ${t("article_content")}<br>` +
            `<strong>{{folder}}</strong> → ${t("feed_folder")}<br>` +
            `<strong>{{feed}}</strong> → ${t("feed_title")}<br>` +
            `<strong>{{filename}}</strong> → ${t("filename")}<br>` +
            `<strong>{{tags}}</strong> → ${t("article_tags")}<br>` +
            `<strong>{{media}}</strong> → ${t("article_media")}<br>` +
            `<strong>{{highlights}}</strong> → ${t("highlights")}`;

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
            `<strong>{{title}}</strong> → ${t("article_title")}<br>` +
            `<strong>{{link}}</strong> → ${t("article_link")}<br>` +
            `<strong>{{author}}</strong> → ${t("article_author")}<br>` +
            `<strong>{{published}}</strong> → ${t("article_published")}<br>` +
            `<strong>{{created}}</strong> → ${t("note_created")}<br>` +
            `<strong>{{description}}</strong> → ${t("article_description")}<br>` +
            `<strong>{{content}}</strong> → ${t("article_content")}<br>` +
            `<strong>{{folder}}</strong> → ${t("feed_folder")}<br>` +
            `<strong>{{feed}}</strong> → ${t("feed_title")}<br>` +
            `<strong>{{tags}}</strong> → ${t("article_tags")}<br>` +
            `<strong>{{media}}</strong> → ${t("article_media")}<br>` +
            `<strong>{{highlights}}</strong> → ${t("highlights")}`;

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

        containerEl.createEl("hr", {cls: "rss-divider"});
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

        new Setting(containerEl)
            .setName(t("display_style"))
            .addDropdown(dropdown => {
                return dropdown
                    .addOption("list", t("list"))
                    .addOption("cards", t("cards"))
                    .setValue(this.plugin.settings.displayStyle)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            displayStyle: value
                        }));
                    });
            });

        containerEl.createEl("h2", {text: t("content")});

        new Setting(containerEl)
            .setName(t("provider"))
            .addDropdown(dropdown => {
                for (let feedProvider of this.plugin.providers.getAll()) {
                    dropdown.addOption(feedProvider.id(), feedProvider.name());
                }
                dropdown
                    .setValue(this.plugin.settings.provider)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            provider: value
                        }));
                        this.display();
                    })
            });

        const providerEl = containerEl.createDiv();

        const provider = this.plugin.providers.getCurrent();
        provider.displaySettings(this.plugin, providerEl);


        containerEl.createEl("hr", {cls: "rss-divider"});

        const details = containerEl.createEl("details");
        const summary = details.createEl("summary");
        summary.setText(t("advanced"));
        const advanced = details.createDiv("advanced");

        advanced.createEl("h3", {text: t("customize_terms")});
        advanced.createSpan({text: "Change a few selected terms here. You can help translating the plugin "});
        advanced.createEl("a", {text: "here", href: "https://github.com/joethei/obsidian-rss/tree/master/src/l10n"});

        new Setting(advanced)
            .setName(t("folders"))
            .addText(text => {
                text
                    .setPlaceholder(t("folders"))
                    .setValue(this.plugin.settings.renamedText.folders)
                    .onChange(async value => {
                        await this.plugin.writeSettings(() => ({
                            renamedText: {
                                ...this.plugin.settings.renamedText,
                                folders: value
                            }
                        }));
                    });
            });

        new Setting(advanced)
            .setName(t("filtered_folders"))
            .addText(text => {
                text
                    .setPlaceholder(t("filtered_folders"))
                    .setValue(this.plugin.settings.renamedText.filtered_folders)
                    .onChange(async value => {
                        await this.plugin.writeSettings(() => ({
                            renamedText: {
                                ...this.plugin.settings.renamedText,
                                filtered_folders: value
                            }
                        }));
                    });
            });

        new Setting(advanced)
            .setName(t("no_folder"))
            .addText(text => {
                text
                    .setPlaceholder(t("no_folder"))
                    .setValue(this.plugin.settings.renamedText.no_folder)
                    .onChange(async value => {
                        await this.plugin.writeSettings(() => ({
                            renamedText: {
                                ...this.plugin.settings.renamedText,
                                no_folder: value
                            }
                        }));
                    });
            });

        advanced.createEl("hr", {cls: "rss-divider"});

        new Setting(advanced)
            .setName(t("display_media"))
            .addToggle(toggle => {
               toggle
                   .setValue(this.plugin.settings.displayMedia)
                   .onChange(async value => {
                       await this.plugin.writeSettings(() => ({
                           displayMedia: value
                       }));
                   });
            });
    }
}
