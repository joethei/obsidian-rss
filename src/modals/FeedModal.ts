import {Notice, Setting, TextComponent} from "obsidian";
import RssReaderPlugin from "../main";
import {RssFeed} from "../settings/settings";
import {getFeedItems} from "../parser/rssParser";
import {isValidHttpUrl} from "../consts";
import {BaseModal} from "./BaseModal";

export class FeedModal extends BaseModal {
    name: string;
    url: string;
    folder: string;

    saved = false;

    constructor(plugin: RssReaderPlugin, feed?: RssFeed) {
        super(plugin.app);

        if(feed) {
            this.name = feed.name;
            this.url = feed.url;
            this.folder = feed.folder;
        }
    }

    async display() : Promise<void> {
        const { contentEl } = this;

        contentEl.empty();

        let nameText: TextComponent;
        const name = new Setting(contentEl)
            .setName("Name")
            .setDesc("Name of feed")
            .addText((text) => {
                nameText = text;
                text.setValue(this.name)
                    .onChange((value) => {
                        this.removeValidationError(text);
                       this.name = value;
                    });
            });
        name.controlEl.addClass("rss-setting-input");

        let urlText: TextComponent;
        const url = new Setting(contentEl)
            .setName("url")
            .setDesc("url of feed")
            .addText((text) => {
                urlText = text;
                text.setValue(this.url)
                    .onChange(async(value) => {
                        this.removeValidationError(text);
                        this.url = value;

                    });
            });
        url.controlEl.addClass("rss-setting-input");

        new Setting(contentEl)
            .setName("Folder")
            .addText((text) => {
                text.setValue(this.folder)
                    .onChange((value) => {
                        this.folder = value;
                    });
            });

        const footerEl = contentEl.createDiv();
        const footerButtons = new Setting(footerEl);
        footerButtons.addButton((b) => {
            b.setTooltip("Save")
                .setIcon("checkmark")
                .onClick(async () => {
                    let error = false;
                    if(!nameText.getValue().length) {
                        this.setValidationError(nameText, "you need to specify a name");
                        error = true;
                    }

                    if(!urlText.getValue().length) {
                        this.setValidationError(urlText, "you need to specify a url");
                        error = true;
                    }
                    if(!isValidHttpUrl(urlText.getValue())) {
                        this.setValidationError(urlText, "This url is not valid");
                        error = true;
                    }else {
                        const items = await getFeedItems({name: "test", url: urlText.getValue(), folder: ""});
                        if(items.items.length == 0) {
                            this.setValidationError(urlText, "this feed does not have any entries");
                            error = true;
                        }
                    }

                    if(error) {
                        new Notice("please fix errors before saving.");
                        return;
                    }
                    this.saved = true;
                    this.close();
                });
            return b;
        });
        footerButtons.addExtraButton((b) => {
            b.setIcon("cross")
                .setTooltip("Cancel")
                .onClick(() => {
                    this.saved = false;
                    this.close();
                });
            return b;
        });
    }

    async onOpen() : Promise<void> {
        await this.display();
    }
}
