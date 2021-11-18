import {DropdownComponent, Notice, Setting, TextComponent} from "obsidian";
import RssReaderPlugin from "../main";
import {BaseModal} from "./BaseModal";

export enum FilterType {
    TAGS = 'all articles with tags',
    UNREAD = 'All unread articles(from folders)',
    READ = 'All read articles(from folders)',
    FAVORITES = 'Favorites(from folders)'
}

export enum SortOrder {
    DATE_NEWEST = 'Publication date (new to old)',
    DATE_OLDEST = 'Publication date (old to new)',
    ALPHABET_NORMAL = 'Name (A to Z)',
    ALPHABET_INVERTED = 'Name (Z to A)'
}

export interface FilteredFolder{
    name: string;
    filterType: string;
    filterContent: string;
    sortOrder: string;
}

export class FilteredFolderModal extends BaseModal {
    name: string;
    filterType: string;
    filterContent: string = "";
    sortOrder: string;

    saved = false;

    constructor(plugin: RssReaderPlugin, folder?: FilteredFolder) {
        super(plugin.app);

        if(folder) {
            this.name = folder.name;
            this.filterType = folder.filterType;
            this.filterContent = folder.filterContent;
            this.sortOrder = folder.sortOrder;
        }
    }

    async display() : Promise<void> {
        const { contentEl } = this;

        contentEl.empty();

        let nameText: TextComponent;
        const name = new Setting(contentEl)
            .setName("Name")
            .addText((text) => {
                nameText = text;
                text.setValue(this.name)
                    .onChange((value) => {
                        this.removeValidationError(text);
                        this.name = value;
                    });
            });
        name.controlEl.addClass("rss-setting-input");

        const type = new Setting(contentEl)
            .setName("Type")
            .setDesc("type of filter")
            .addDropdown((dropdown: DropdownComponent) => {
                for(const option in FilterType) {
                    // @ts-ignore
                    dropdown.addOption(option, FilterType[option]);
                }
                dropdown
                    .setValue(this.filterType)
                    .onChange(async (value: string) => {
                        this.filterType = value;
                    });
            });
        type.controlEl.addClass("rss-setting-input");

        new Setting(contentEl)
            .setName("Filter")
            .setDesc("Folders/Tags to filter on, split by ,")
            .addText((text) => {
                text
                    .setValue(this.filterContent)
                    .onChange((value) => {
                        this.filterContent = value;
                        this.removeValidationError(text);
                    });
            });

        const sorting = new Setting(contentEl)
            .setName("Order by")
            .addDropdown((dropdown: DropdownComponent) => {
                for(const order in SortOrder) {
                    // @ts-ignore
                    dropdown.addOption(order, SortOrder[order]);
                }

                dropdown
                    .setValue(this.sortOrder)
                    .onChange(async (value: string) => {
                        this.sortOrder = value;
                    });
            });
        sorting.controlEl.addClass("rss-setting-input");

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
