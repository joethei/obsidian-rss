import {SettingsSection} from "./SettingsSection";
import t from "../l10n/locale";
import {
    DropdownComponent,
    MomentFormatComponent, Notice,
    SearchComponent,
    Setting,
    TextAreaComponent,
    ToggleComponent
} from "obsidian";
import {DEFAULT_SETTINGS} from "./settings";
import {FolderSuggest} from "./FolderSuggestor";

export class FileCreationSettings extends SettingsSection {

    getName(): string {
        return t('file_creation');
    }

    display(): void {
        this.contentEl.empty();

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

        new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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
            new Setting(this.contentEl)
                .setName(t("file_location_folder"))
                .setDesc(t("file_location_folder_help"))
                .addSearch(async (search: SearchComponent) => {
                    new FolderSuggest(this.plugin.app, search.inputEl);
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
        const dateFormat = new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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
    }

}
