import {DropdownComponent, Notice, SearchComponent, Setting, TextComponent} from "obsidian";
import RssReaderPlugin from "../main";
import {BaseModal} from "./BaseModal";
import t from "../l10n/locale";
import {ArraySuggest} from "../view/ArraySuggest";
import {get} from "svelte/store";
import {folderStore, tagsStore} from "../stores";

export enum FilterType {
    TAGS,
    UNREAD,
    READ,
    FAVORITES
}

export enum SortOrder {
    DATE_NEWEST,
    DATE_OLDEST,
    ALPHABET_NORMAL,
    ALPHABET_INVERTED
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
    filterContent = "";
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
            .setName(t("name"))
            .setDesc(t("filter_name_help"))
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
            .setName(t("filter_type"))
            .setDesc(t("filter_type_help"))
            .addDropdown((dropdown: DropdownComponent) => {
                for(const option in FilterType) {
                    if(option.length > 1) {
                        // @ts-ignore
                        dropdown.addOption(option, t("filter_" + option.toLowerCase()));
                    }
                }
                dropdown
                    .setValue(this.filterType)
                    .onChange(async (value: string) => {
                        this.filterType = value;
                    });
            });
        type.controlEl.addClass("rss-setting-input");

        new Setting(contentEl)
            .setName(t("filter"))
            .setDesc(t("filter_help"))
            .addSearch(async (search: SearchComponent) => {
                new ArraySuggest(this.app, search.inputEl, new Set([...get(tagsStore), ...get(folderStore)]));
                search
                    .setValue(this.filterContent)
                    .onChange(async (value: string) => {
                        this.filterContent = value;
                    });
            });

        const sorting = new Setting(contentEl)
            .setName(t("sort"))
            .addDropdown((dropdown: DropdownComponent) => {
                for(const order in SortOrder) {
                    if(order.length > 1) {
                        // @ts-ignore
                        dropdown.addOption(order, t("sort_" + order.toLowerCase()));
                    }
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
            b.setTooltip(t("save"))
                .setIcon("checkmark")
                .onClick(async () => {
                    let error = false;
                    if(!nameText.getValue().length) {
                        this.setValidationError(nameText, t("invalid_name"));
                        error = true;
                    }

                    if(error) {
                        new Notice(t("fix_errors"));
                        return;
                    }
                    this.saved = true;
                    this.close();
                });
            return b;
        });
        footerButtons.addExtraButton((b) => {
            b.setIcon("cross")
                .setTooltip(t("cancel"))
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
