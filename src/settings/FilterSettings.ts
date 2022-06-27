import t from "../l10n/locale";
import {ButtonComponent, Notice, Setting} from "obsidian";
import {FilteredFolderModal} from "../modals/FilteredFolderModal";
import RssReaderPlugin from "../main";

export function displayFilterSettings(plugin: RssReaderPlugin, containerEl: HTMLElement) : void {

    containerEl.empty();

    containerEl.createEl("hr", {attr: {style: "border-top: 5px solid var(--background-modifier-border);"}});
    containerEl.createEl("h3", {text: t("filtered_folders")});

    new Setting(containerEl)
        .setName(t("add_new"))
        .setDesc(t("add_new_filter"))
        .addButton((button: ButtonComponent): ButtonComponent => {
            return button
                .setTooltip(t("add_new_filter"))
                .setIcon("plus")
                .onClick(async () => {
                    const modal = new FilteredFolderModal(plugin);

                    modal.onClose = async () => {
                        if (modal.saved) {
                            if (plugin.settings.filtered.some(folder => folder.name === modal.name)) {
                                new Notice(t("filter_exists"));
                                return;
                            }
                            await plugin.writeFiltered(() => (
                                plugin.settings.filtered.concat({
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
                            displayFilterSettings(plugin, containerEl);
                        }
                    };

                    modal.open();
                });
        });

    const filterContainer = containerEl.createDiv(
        "filter-container"
    );
    const filtersDiv = filterContainer.createDiv("filters");
    for (const id in plugin.settings.filtered.sort((a, b) => a.name.localeCompare(b.name))) {
        const filter = plugin.settings.filtered[id];
        if(filter === undefined) {
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
                        const modal = new FilteredFolderModal(plugin, filter);
                        const oldFilter = filter;

                        modal.onClose = async () => {
                            if (modal.saved) {
                                const filters = plugin.settings.filtered;
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
                                await plugin.writeFiltered(() => (filters));
                                displayFilterSettings(plugin, containerEl);
                            }
                        };

                        modal.open();
                    });
            })
            .addExtraButton((b) => {
                b.setIcon("lucide-trash")
                    .setTooltip(t("delete"))
                    .onClick(async () => {
                        const filters = plugin.settings.filtered;
                        filters.remove(filter);
                        await plugin.writeFiltered(() => (filters));
                        displayFilterSettings(plugin, containerEl);
                    });
            });

    }
}
