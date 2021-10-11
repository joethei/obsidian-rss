import {App, htmlToMarkdown, Modal, Notice, Setting} from "obsidian";
import {FeedItem} from "feedme";

export class FeedItemModal extends Modal {

    private item: FeedItem;

    constructor(app: App, item: FeedItem) {
        super(app);
        this.item = item;
    }

    onOpen() {
        let { contentEl } = this;
        let title = contentEl.createEl('h1', 'title');
        title.setText(this.item.title as string);
        let content = contentEl.createDiv('content');
        if(this.item.content) {
            content.innerHTML = this.item.content as string;
        }else if (this.item['content:encoded']){
            content.innerHTML = this.item['content:encoded'] as string;
        }

        new Setting(contentEl).addButton((button) => {
            button.setButtonText("Add to new note").onClick(() => {
                new Notice("not implemented yet");
            });
        });

        new Setting(contentEl).addButton((button) => {
            button.setButtonText("paste to current note").onClick(() => {
                new Notice("not implemented yet");
            });
        });

    }

    onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}
