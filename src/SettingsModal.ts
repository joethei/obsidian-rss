import {Modal, Setting} from "obsidian";
import RssReaderPlugin from "./main";
import {RssFeed} from "./settings";

export class SettingsModal extends Modal {
    name: string;
    url: string;

    saved: boolean = false;

    constructor(plugin: RssReaderPlugin, feed?: RssFeed) {
        super(plugin.app);

        if(feed) {
            this.name = feed.name;
            this.url = feed.url;
        }
    }

    async display() {
        let { contentEl } = this;

        contentEl.empty();

        const name = new Setting(contentEl)
            .setName("Name")
            .setDesc("Name of feed")
            .addText((text) => {
                text.setValue(this.name)
                    .onChange((value) => {
                       if(!value.length) {
                           //todo: validate
                       }
                       this.name = value;

                    });
            });

        const url = new Setting(contentEl)
            .setName("url")
            .setDesc("url of feed")
            .addText((text) => {
                text.setValue(this.url)
                    .onChange((value) => {
                        if(!value.length) {
                            //todo: validate
                        }
                        this.url = value;

                    });
            });

        let footerEl = contentEl.createDiv();
        let footerButtons = new Setting(footerEl);
        footerButtons.addButton((b) => {
            b.setTooltip("Save")
                .setIcon("checkmark")
                .onClick(async () => {
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

    onOpen() {
        this.display();
    }
}
