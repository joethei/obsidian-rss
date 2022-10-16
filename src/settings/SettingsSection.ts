import RssReaderPlugin from "../main";

export abstract class SettingsSection {
    protected readonly plugin: RssReaderPlugin;
    protected readonly containerEl: HTMLDivElement;
    protected readonly contentEl: HTMLDivElement;

    constructor(plugin: RssReaderPlugin, containerEl: HTMLDivElement, divider = true) {
        this.plugin = plugin;
        this.containerEl = containerEl;

        this.containerEl.createEl('h3', {text: this.getName()});
        this.contentEl = this.containerEl.createDiv('settings-section');
        if(divider)
            this.containerEl.createEl("hr", {cls: "rss-divider"});
    }

    public abstract getName() : string;

    public abstract display(): void;
}
