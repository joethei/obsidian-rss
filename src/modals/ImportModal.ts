import {Modal, Notice, Setting} from "obsidian";
import {loadFeedsFromString} from "../parser/opmlParser";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";

//adapted from javalent's code here: https://discord.com/channels/686053708261228577/840286264964022302/918146537220112455
export class ImportModal extends Modal {

    plugin: RssReaderPlugin;

    constructor(plugin: RssReaderPlugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    importData = "";

    async onOpen() : Promise<void> {
        const setting = new Setting(this.contentEl).setName(t("choose_file")).setDesc(t("choose_file_help"));
        const input = setting.controlEl.createEl("input", {
            attr: {
                type: "file",
                accept: ".xml,.opml",
            }
        });

        input.onchange = async () => {
            const {files} = input;
            if (!files.length) return;
            for (const id in files) {
                const file = files[id];
                const reader = new FileReader();
                reader.onload = () => {
                    this.importData = reader.result as string;
                }
                reader.readAsText(file);
            }
        }

        new Setting(this.contentEl).addButton((button) => {
            button
                .setIcon("import-glyph")
                .setTooltip(t("import"))
                .onClick(async () => {
                    if (this.importData) {
                        const feeds = await loadFeedsFromString(this.importData);
                        await this.plugin.writeFeeds(() => (this.plugin.settings.feeds.concat(feeds)));
                        new Notice(t("imported_x_feeds", String(feeds.length)));
                        this.close();
                    } else {
                        new Notice(t("fix_errors"));
                    }
                });
        }).addExtraButton((button) => {
            button
                .setIcon("cross")
                .setTooltip(t("cancel"))
                .onClick(() => {
                    this.close();
                })
        });
    }
}
