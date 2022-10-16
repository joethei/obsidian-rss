import {SettingsSection} from "./SettingsSection";
import t from "../l10n/locale";
import {Setting} from "obsidian";

export class AdvancedSettings extends SettingsSection {

    getName(): string {
        return t('advanced');
    }

    display() {
        this.contentEl.createEl("h4", {text: t("customize_terms")});
        this.contentEl.createSpan({text: "Change a few selected terms here. You can help translating the plugin "});
        this.contentEl.createEl("a", {text: "here", href: "https://github.com/joethei/obsidian-rss/tree/master/src/l10n"});

        new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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

        this.contentEl.createEl("hr", {cls: "rss-divider"});

        new Setting(this.contentEl)
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
