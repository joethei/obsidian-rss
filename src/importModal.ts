import {App, Modal, Notice, Setting} from "obsidian";
import {loadFeedsFromString} from "./opmlParser";
import RssReaderPlugin from "./main";

export class ImportModal extends Modal {
    importData: string;
    plugin: RssReaderPlugin;

    constructor(app: App, plugin: RssReaderPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.createEl("h1", {text: "Import OPML"});
        new Setting(contentEl).setName("Data").setDesc("paste the content of the OPML file here:").addText((text) => {
            text.onChange((value) => {
                this.importData = value;
            })
        });
        new Setting(contentEl).addButton((btn) => btn.setButtonText("Import").setCta().onClick(async() => {
            const imported = await loadFeedsFromString(this.importData);
            if(imported.length == 0) {
                new Notice("could not import anything");
                this.close();
                return;
            }
            const feeds = this.plugin.settings.feeds;
            feeds.concat(imported);
            await this.plugin.writeSettings(() => ({
                feeds: feeds
            }));
            new Notice("imported " + imported.length + " feeds");
            this.close();
        }));
    }

    onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}



