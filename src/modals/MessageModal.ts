import {Modal} from "obsidian";
import RssReaderPlugin from "../main";
import t from "../l10n/locale";

export class MessageModal extends Modal {

    message: string;

    constructor(plugin: RssReaderPlugin, message: string) {
        super(plugin.app);
        this.message = message;
    }

    onOpen() : void {
        this.display();
    }

    display() : void {
        const {contentEl} = this;

        contentEl.empty();

        contentEl.createEl("h1", {text: this.message});
        contentEl.createEl("p", {text: t("do_not_close")});
    }

    setMessage(message: string) : void {
        this.message = message;
        this.display();
    }

}
