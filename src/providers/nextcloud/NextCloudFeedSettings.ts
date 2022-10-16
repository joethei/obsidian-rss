import {SettingsSection} from "../../settings/SettingsSection";
import {Setting} from "obsidian";
import RssReaderPlugin from "../../main";
import {NextcloudFeedProvider} from "./NextcloudFeedProvider";
import {ProviderValidation} from "../../settings/ProviderValidation";

export class NextCloudFeedSettings extends SettingsSection {
    private readonly provider: NextcloudFeedProvider;
    private readonly validation: ProviderValidation;

    constructor(plugin: RssReaderPlugin, containerEl: HTMLDivElement, provider: NextcloudFeedProvider) {
        super(plugin, containerEl, false);
        this.provider = provider;

        this.validation = new ProviderValidation(this.provider, this.contentEl);
    }

    getName(): string {
        return "";
    }

    async display() {
        this.contentEl.empty();

        const authData = this.provider.getAuthData();

        new Setting(this.contentEl)
            .setName("Server")
            .addText(text => {
                text
                    .setPlaceholder("https://your-nextcloud.server.zyx")
                    .setValue(authData.server)
                    .onChange(value => {
                        localStorage.setItem(this.provider.server_key, value);
                    });
            });

        new Setting(this.contentEl)
            .setName("Username")
            .addText(text => {
                text
                    .setPlaceholder("your-username")
                    .setValue(authData.username)
                    .onChange(value => {
                        localStorage.setItem(this.provider.user_key, value);
                    });
            });

        new Setting(this.contentEl)
            .setName("Password")
            .addText(text => {
                text
                    .setPlaceholder("your password")
                    .setValue(authData.password)
                    .onChange(value => {
                        localStorage.setItem(this.provider.password_key, value);
                    });
                text.inputEl.type = "password";
            });

        await this.validation.display();
    }
}
