import {SettingsSection} from "./SettingsSection";
import t from "../l10n/locale";
import {Notice, Setting, TextComponent, ToggleComponent} from "obsidian";
import {DEFAULT_SETTINGS} from "./settings";

export class MiscSettings extends SettingsSection {

    getName(): string {
        return t('misc');
    }

    display() {
        this.contentEl.empty();

        const refresh = new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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

        new Setting(this.contentEl)
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
    }

}
