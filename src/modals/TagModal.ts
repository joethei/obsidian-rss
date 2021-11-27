import {BaseModal} from "./BaseModal";
import RssReaderPlugin from "../main";
import {SearchComponent, Setting} from "obsidian";
import {NUMBER_REGEX, TAG_REGEX} from "../consts";
import {TagSuggest} from "../view/TagSuggest";

export class TagModal extends BaseModal {
    plugin: RssReaderPlugin;
    tags: string[];

    constructor(plugin: RssReaderPlugin, tags: string[]) {
        super(plugin.app);
        this.plugin = plugin;
        this.tags = tags;
    }

    display(): void {
        const {contentEl} = this;
        contentEl.empty();

        contentEl.createEl("h1", {text: "Edit Tags"});

        const tagDiv = contentEl.createDiv("tags");

        for (const tag in this.tags) {
            new Setting(tagDiv)
                .addSearch(async (search: SearchComponent) => {
                    new TagSuggest(this.app, search.inputEl);
                    search
                        .setValue(this.tags[tag])
                        .onChange(async (value: string) => {
                            if (!value.match(TAG_REGEX) || value.match(NUMBER_REGEX) || value.contains(" ") || value.contains('#')) {
                                this.setValidationError(search, "This is not a valid tag");
                                return;
                            }
                            this.tags = this.tags.filter(e => e !== this.tags[tag]);
                            this.tags.push(value);
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setTooltip("Delete")
                        .setIcon("trash")
                        .onClick(() => {
                            this.tags = this.tags.filter(e => e !== this.tags[tag]);
                            this.display();
                        });

                });
        }

        let tagValue = "";
        let tagComponent: SearchComponent;
        const newTag = new Setting(tagDiv)
            .addSearch(async (search: SearchComponent) => {
                tagComponent = search;
                new TagSuggest(this.app, search.inputEl);
                search
                    .onChange(async (value: string) => {
                        if (!value.match(TAG_REGEX) || value.match(NUMBER_REGEX) || value.contains(" ") || value.contains('#')) {
                            this.setValidationError(search, "This is not a valid tag");
                            return;
                        }
                        tagValue = value;
                    });
            }).addExtraButton(button => {
                button
                    .setTooltip("Create")
                    .setIcon("create-new")
                    .onClick(() => {
                        if (!tagValue.match(TAG_REGEX) || tagValue.match(NUMBER_REGEX) || tagValue.contains(" ") || tagValue.contains('#')) {
                            this.setValidationError(tagComponent, "This is not a valid tag");
                            return;
                        }
                        this.tags.push(tagValue);
                        this.display();
                    });
        });
        newTag.controlEl.addClass("rss-setting-input");

        const buttonEl = contentEl.createSpan("actionButtons");

        new Setting(buttonEl).addExtraButton((btn) => btn.setTooltip("Save").setIcon("checkmark").onClick(async () => {
            this.close();
        }));
    }

    onClose(): void {
        const {contentEl} = this;
        contentEl.empty();
    }

    async onOpen(): Promise<void> {
        await this.display();
    }

}
