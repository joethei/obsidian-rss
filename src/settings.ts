import {App, ButtonComponent, PluginSettingTab, Setting, TextAreaComponent} from "obsidian";
import MyPlugin from "./main";
import RssReaderPlugin from "./main";
import {SettingsModal} from "./SettingsModal";

export interface RssFeed {
    name: string;
    url: string;
    folder: string;
}

export interface RssReaderSettings {
    feeds: RssFeed[];
    template: string;
}

export const DEFAULT_SETTINGS: RssReaderSettings = Object.freeze({
    feeds: [],
    template: "---\n" +
        "link: {{link}}\n" +
        "author: {{author}}\n" +
        "published: {{published}}\n" +
        "---\n" +
        "{{content}}",
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
            .setName("New file template")
            .setDesc('When creating a note from a rss feed item this gets processed. Available variables are: {{title}}, {{link}}, {{author}}, {{published}}, {{content}}')
            .addTextArea((textArea: TextAreaComponent): TextAreaComponent => {
                textArea
                    .setValue(this.plugin.settings.template)
                    .setPlaceholder(DEFAULT_SETTINGS.template)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            template: value
                        }));
                    });
                textArea.inputEl.setAttr("rows", 8);
                return textArea;
        });

        containerEl.createEl("h3", {text: "Feeds"});

        new Setting(containerEl)
            .setName("Add New")
            .setDesc("Add a new Feed.")
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip("add new Feed")
                    .setButtonText("+")
                    .onClick(async () => {
                        let modal = new SettingsModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                await this.plugin.writeSettings(() => ({
                                    feeds: this.plugin.settings.feeds.concat({name: modal.name, url: modal.url, folder: modal.folder})
                                }));
                                this.display();
                            }
                        };

                        modal.open();
                    });
            });

        const additionalContainer = containerEl.createDiv(
            "feed-container"
        );

        const additional = additionalContainer.createDiv("feeds");
        for (let a in this.plugin.settings.feeds) {
            const feed = this.plugin.settings.feeds[a];

            let setting = new Setting(additional);

            setting.setName((feed.folder ? feed.folder : "No Folder") + " - " + feed.name);
            setting.setDesc(feed.url);

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
                                    feeds.push({name: modal.name, url: modal.url, folder: modal.folder});
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
                        .onClick(async() => {
                            let feeds = this.plugin.settings.feeds;
                            feeds.remove(feed);
                            await this.plugin.writeSettings(() => ({
                                feeds: feeds,
                            }));
                            this.display();
                        });
                });
        }

    }
}
