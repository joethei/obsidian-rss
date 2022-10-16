import {
    App,
    PluginSettingTab,
} from "obsidian";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";
import {HotkeySettings} from "./HotkeySettings";
import {ProviderSettings} from "./ProviderSettings";
import {FileCreationSettings} from "./FileCreationSettings";
import {AdvancedSettings} from "./AdvancedSettings";
import {MiscSettings} from "./MiscSettings";

export class RSSReaderSettingsTab extends PluginSettingTab {
    plugin: RssReaderPlugin;

    constructor(app: App, plugin: RssReaderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new ProviderSettings(this.plugin, containerEl.createDiv('content')).display();
        new FileCreationSettings(this.plugin, containerEl.createDiv('file-creation')).display();
        new MiscSettings(this.plugin, containerEl.createDiv('misc')).display();
        new HotkeySettings(this.plugin, containerEl.createDiv('hotkeys')).display();
        new AdvancedSettings(this.plugin, this.containerEl.createDiv('advanced'), false).display();

    }
}
