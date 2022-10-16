import {SettingsSection} from "./SettingsSection";
import {Setting} from "obsidian";
import t from "../l10n/locale";

export class ProviderSettings extends SettingsSection {

    getName(): string {
        return t('content');
    }

    display(): void {
        this.contentEl.empty();

        new Setting(this.contentEl)
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

        this.contentEl.createEl("hr", {cls: "rss-divider"});

        const providerEl = this.contentEl.createDiv();

        const provider = this.plugin.providers.getCurrent();
        provider.settings(providerEl).display();
    }

}
