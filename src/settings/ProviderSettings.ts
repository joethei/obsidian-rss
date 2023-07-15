import {SettingsSection} from "./SettingsSection";
import t from "../l10n/locale";

export class ProviderSettings extends SettingsSection {

    getName(): string {
        return t('content');
    }

    display(): void {
        this.contentEl.empty();

       /* new Setting(this.contentEl)
            .setName(t("provider"))
            .addDropdown(dropdown => {
                for (const feedProvider of this.plugin.providers.getAll()) {
                    dropdown.addOption(feedProvider.id(), feedProvider.name());
                }
                dropdown
                    .setValue(this.plugin.settings.provider)
                    .onChange(async (value) => {
                        this.plugin.settings.provider = value;
                        await this.plugin.saveSettings();
                        this.display();
                    })
            });*/

        const providerEl = this.contentEl.createDiv();

        const provider = this.plugin.providers.getCurrent();
        provider.settings(providerEl).display();
    }

}
