import {App, ButtonComponent, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "./main";
import RssReaderPlugin from "./main";
import {SettingsModal} from "./SettingsModal";

export interface RssFeed {
    name: string;
    url: string;
}

export interface RssReaderSettings {
    feeds: RssFeed[];
}

export const DEFAULT_SETTINGS: RssReaderSettings = Object.freeze({
    feeds: [],
});

export class RSSReaderSettingsTab extends PluginSettingTab {
    plugin: RssReaderPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'RSS Reader Settings'});

        new Setting(containerEl)
            .setName("Add New")
            .setDesc("Add a new Feed.")
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip("Add Additional")
                    .setButtonText("+")
                    .onClick(async () => {
                        let modal = new SettingsModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                await this.plugin.writeSettings(() => ({
                                    feeds: this.plugin.settings.feeds.concat({name: modal.name, url: modal.url})
                                }));
                                this.display();
                            }
                        };

                        modal.open();
                    });
            });

        const additionalContainer = containerEl.createDiv(
            "admonition-setting-additional-container"
        );

        const additional = additionalContainer.createDiv("additional");
        for (let a in this.plugin.settings.feeds) {
            const feed = this.plugin.settings.feeds[a];

            let setting = new Setting(additional);


            setting.infoEl.setText(feed.name);

            setting
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip("Edit")
                        .onClick(() => {
                            let modal = new SettingsModal(this.plugin, feed);
                            let oldFeed = feed;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    let feeds = this.plugin.settings.feeds;
                                    feeds.remove(oldFeed);
                                    feeds.concat({name: modal.name, url: modal.url});
                                    await this.plugin.writeSettings(() => ({
                                        feeds: feeds
                                    }));
                                    this.display();
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash")
                        .setTooltip("Delete")
                        .onClick(() => {
                            let feeds = this.plugin.settings.feeds;
                            feeds.remove(feed);
                            this.plugin.writeSettings(() => ({
                                feeds: feeds,
                            }));
                            this.display();
                        });
                });
        }

    }
}
