import {
    App,
    ButtonComponent,
    Notice,
    PluginSettingTab,
    Setting,
    TextAreaComponent,
    TextComponent
} from "obsidian";
import MyPlugin from "./main";
import RssReaderPlugin from "./main";
import {SettingsModal} from "./SettingsModal";
import {FeedItems} from "./stores";
import groupBy from "lodash.groupby";

export interface RssFeed {
    name: string;
    url: string;
    folder: string;
}

export interface RssReaderSettings {
    feeds: RssFeed[];
    template: string;
    updateTime: number;
    read: FeedItems,
    favorites: FeedItems,
}

export const DEFAULT_SETTINGS: RssReaderSettings = Object.freeze({
    feeds: [],
    read: {items: []},
    favorites: {items: []},
    updateTime: 60,
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
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'RSS Reader Settings'});

        new Setting(containerEl)
            .setName("New file template")
            .setDesc('When creating a note from a rss feed item this gets processed. Available variables are: {{title}}, {{link}}, {{author}}, {{published}}, {{content}}')
            .addTextArea((textArea: TextAreaComponent) => {
                textArea
                    .setValue(this.plugin.settings.template)
                    .setPlaceholder(DEFAULT_SETTINGS.template)
                    .onChange(async (value) => {
                        await this.plugin.writeSettings(() => ({
                            template: value
                        }));
                    });
                textArea.inputEl.setAttr("rows", 8);
            });

        const refresh = new Setting(containerEl)
            .setName("Refresh time")
            .setDesc("How often should the feeds be refreshed, in minutes")
            .addText((text: TextComponent)  => {
                text
                    .setPlaceholder(String(DEFAULT_SETTINGS.updateTime))
                    .setValue(String(this.plugin.settings.updateTime))
                    .onChange(async(value) => {
                        if(value.length === 0) {
                            new Notice("please specify a value");
                            return;
                        }
                        if(Number(value) == 0) {
                            new Notice("please specify a bigger value");
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
               .onClick(async() => {
                   await this.plugin.writeSettings(() => ({
                       updateTime: DEFAULT_SETTINGS.updateTime
                   }));
                   this.display();
               });
        });

        containerEl.createEl("h3", {text: "Feeds"});

        new Setting(containerEl)
            .setName("Add New")
            .setDesc("Add a new Feed.")
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip("add new Feed")
                    .setIcon("create-new")
                    .onClick(async () => {
                        const modal = new SettingsModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                if (this.plugin.settings.feeds.some(item => item.url === modal.url)) {
                                    new Notice("you already have a feed configured with that url");
                                    return;
                                }
                                await this.plugin.writeFeeds(() => (
                                    this.plugin.settings.feeds.concat({
                                            name: modal.name,
                                            url: modal.url,
                                            folder: modal.folder
                                        }
                                    )));
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
        const sorted = groupBy(this.plugin.settings.feeds, "folder");
        for (const [, feeds] of Object.entries(sorted)) {
            for (const id in feeds) {
                const feed = feeds[id];

                const setting = new Setting(additional);

                setting.setName((feed.folder ? feed.folder : "No Folder") + " - " + feed.name);
                setting.setDesc(feed.url);

                setting
                    .addExtraButton((b) => {
                        b.setIcon("pencil")
                            .setTooltip("Edit")
                            .onClick(() => {
                                const modal = new SettingsModal(this.plugin, feed);
                                const oldFeed = feed;

                                modal.onClose = async () => {
                                    if (modal.saved) {
                                        const feeds = this.plugin.settings.feeds;
                                        feeds.remove(oldFeed);
                                        feeds.push({name: modal.name, url: modal.url, folder: modal.folder});
                                        await this.plugin.writeFeeds(() => (feeds));
                                        this.display();
                                    }
                                };

                                modal.open();
                            });
                    })
                    .addExtraButton((b) => {
                        b.setIcon("trash")
                            .setTooltip("Delete")
                            .onClick(async () => {
                                const feeds = this.plugin.settings.feeds;
                                feeds.remove(feed);
                                await this.plugin.writeFeeds(() => (feeds));
                                this.display();
                            });
                    });
            }

        }
    }
}
