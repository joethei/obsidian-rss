import t from "../l10n/locale";
import {ButtonComponent, Notice, Setting} from "obsidian";
import {FilteredFolderModal} from "../modals/FilteredFolderModal";
import {SettingsSection} from "./SettingsSection";

export class FilterSettings extends SettingsSection {
    getName(): string {
        return t('filtered_folders');
    }

    display() {

        this.contentEl.empty();

        new Setting(this.contentEl)
            .setName(t("add_new"))
            .setDesc(t("add_new_filter"))
            .addButton((button: ButtonComponent): ButtonComponent => {
                return button
                    .setTooltip(t("add_new_filter"))
                    .setIcon("plus")
                    .onClick(async () => {
                        const modal = new FilteredFolderModal(this.plugin);

                        modal.onClose = async () => {
                            if (modal.saved) {
                                if (this.plugin.settings.filtered.some(folder => folder.name === modal.name)) {
                                    new Notice(t("filter_exists"));
                                    return;
                                }
                                await this.plugin.writeFiltered(() => (
                                    this.plugin.settings.filtered.concat({
                                            name: modal.name,
                                            sortOrder: modal.sortOrder,
                                            filterFeeds: modal.filterFeeds,
                                            filterFolders: modal.filterFolders,
                                            filterTags: modal.filterTags,
                                            favorites: modal.favorites,
                                            ignoreFolders: modal.ignoreFolders,
                                            ignoreFeeds: modal.ignoreFeeds,
                                            ignoreTags: modal.ignoreTags,
                                            read: modal.read,
                                            unread: modal.unread,
                                        }
                                    )));
                                this.display();
                            }
                        };

                        modal.open();
                    });
            });

        const filterContainer = this.contentEl.createDiv(
            "filter-container"
        );
        const filtersDiv = filterContainer.createDiv("filters");
        for (const id in this.plugin.settings.filtered.sort((a, b) => a.name.localeCompare(b.name))) {
            const filter = this.plugin.settings.filtered[id];
            if (filter === undefined) {
                continue;
            }
            const setting = new Setting(filtersDiv);

            setting.setName(filter.name);

            const description: string[] = [];
            if (filter.read)
                description.push(t("read"));
            if (filter.unread)
                description.push(t("unread"));
            if (filter.favorites)
                description.push(t("favorites"));

            let message = "";
            if (filter.filterFolders !== undefined && filter.filterFolders.length > 0) {
                const folders = filter.filterFolders.join(",");
                message += "; " + t("from_folders") + folders;
            }
            if (filter.filterFeeds !== undefined && filter.filterFeeds.length > 0) {
                const feeds = filter.filterFeeds.join(",");
                message += "; " + t("from_feeds") + feeds;
            }
            if (filter.filterTags !== undefined && filter.filterTags.length > 0) {
                const tags = filter.filterTags.join(",");
                message += "; " + t("with_tags") + tags;
            }

            setting.setDesc(description.join(",") + message);


            setting
                .addExtraButton((b) => {
                    b.setIcon("edit")
                        .setTooltip(t("edit"))
                        .onClick(() => {
                            const modal = new FilteredFolderModal(this.plugin, filter);
                            const oldFilter = filter;

                            modal.onClose = async () => {
                                if (modal.saved) {
                                    const filters = this.plugin.settings.filtered;
                                    filters.remove(oldFilter);
                                    filters.push({
                                        name: modal.name,
                                        sortOrder: modal.sortOrder,
                                        filterFeeds: modal.filterFeeds,
                                        filterFolders: modal.filterFolders,
                                        filterTags: modal.filterTags,
                                        ignoreFolders: modal.ignoreFolders,
                                        ignoreFeeds: modal.ignoreFeeds,
                                        ignoreTags: modal.ignoreTags,
                                        favorites: modal.favorites,
                                        read: modal.read,
                                        unread: modal.unread,
                                    });
                                    await this.plugin.writeFiltered(() => (filters));
                                    this.display();
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("lucide-trash")
                        .setTooltip(t("delete"))
                        .onClick(async () => {
                            const filters = this.plugin.settings.filtered;
                            filters.remove(filter);
                            await this.plugin.writeFiltered(() => (filters));
                            this.display();
                        });
                });
        }
    }
}
