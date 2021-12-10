<script lang="ts">
    import {FilteredFolderContent, filteredItemsStore, foldedState, sortedFeedsStore} from "../stores";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";
    import ItemView from "./ItemView.svelte";
    import FeedView from "./FeedView.svelte";
    import {Menu} from "obsidian";
    import Action from "../actions/Action";
    import {RssFeedItem} from "../parser/rssParser";
    import t from "../l10n/locale";

    export let plugin: RssReaderPlugin;

    let folded: string[] = [];
    foldedState.subscribe(value => {
        folded = value;
    });

    function toggleFold(folder: string) {
        console.log("toggling fold for " + folder);
        if (!folded) {
            folded = [];
        }
        if (folded.contains(folder)) {
            folded.remove(folder);
        } else folded.push(folder);
        plugin.writeFolded(folded);
    }

    async function openMenuForFolder(e: MouseEvent, folder: string): Promise<void> {
        const items: RssFeedItem[] = [];
        for (const feed of $sortedFeedsStore[folder]) {
            for (let item of feed.items) {
                items.push(item);
            }
        }
        await openMenu(e, items);
    }

    async function openMenu(e: MouseEvent, feedItems: RssFeedItem[]): Promise<void> {
        const menu = new Menu(plugin.app);

        menu.addItem((menuItem) => {
            menuItem
                .setIcon("create-new")
                .setTitle(t("create_all"))
                .onClick(async () => {
                    for (const item of feedItems) {
                        await Action.CREATE_NOTE.processor(plugin, item);
                    }
                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setIcon("feather-eye")
                .setTitle(t("mark_all_as_read"))
                .onClick(async () => {
                    for (const item of feedItems) {
                        item.read = true;
                    }
                    const items = plugin.settings.items;
                    await plugin.writeFeedContent(() => {
                        return items;
                    });
                });
        });

        menu.showAtPosition({x: e.x, y: e.y});
    }

    function buildTreeStructure(filteredContent: FilteredFolderContent[]): any[] {
        //based on: https://stackoverflow.com/a/57344801/5589264
        let result = [];
        let level = {result};

        filteredContent.forEach(filter => {
            filter.filter.name.split('/').reduce((r, name, i, a) => {
                if (!r[name]) {
                    r[name] = {result: []};
                    if (filter.filter.name.endsWith(name)) {
                        r.result.push({name, children: r[name].result, filter: filter});
                    } else {
                        r.result.push({name, children: r[name].result});
                    }
                }

                return r[name];
            }, level)
        });
        return result;
    }

</script>

{#if !folded}
    <p>Loading</p>
{:else}
    <div>
        {#if $filteredItemsStore}
            <div class="rss-filtered-folders">
                <div class="{folded.contains('rss-filters') ? 'is-collapsed' : ''} tree-item is-clickable"
                     on:click={() => toggleFold('rss-filters')}>
                    <span class="tree-item-self is-clickable">
                        <IconComponent iconName="feather-chevron-down"/>
                        <div>{t("filtered_folders")}</div>
                    </span>
                </div>

                {#if (!folded.contains('rss-filters'))}
                    <span>
                        {#each buildTreeStructure($filteredItemsStore) as folder}
                            <div class="tree-item-children">
                                <div class="{folded.contains('rss-filters-' + folder.name) ? 'is-collapsed' : ''} tree-item is-clickable"
                                     on:click={() => toggleFold('rss-filter-' + folder.name)}>
                                    <span class="tree-item-self is-clickable">
                                        <IconComponent iconName="feather-chevron-down"/>
                                        <span>{ folder.name }</span>
                                    </span>
                                    </div>
                                {#if folder.filter !== undefined}
                                    {#if (folded.contains('rss-filter-' + folder.filter.filter.name))}
                                        <div class="tree-item-children">
                                            {#each folder.filter.items.items as item}
                                                <div class="tree-item">
                                                    <div class="tree-item-self">
                                                        <ItemView item={item} plugin={plugin}/>
                                                    </div>
                                                </div>
                                            {/each}
                                        </div>
                                    {/if}
                                {/if}
                                {#if folder.children}
                                    {#each folder.children as child}
                                        <div class="tree-item-children">
                                            <div class="{folded.contains('rss-filters-' + child.name) ? 'is-collapsed' : ''} tree-item-self is-clickable"
                                                 on:click={() => toggleFold('rss-filter-' + child.filter.filter.name)}>
                                                    <IconComponent iconName="feather-chevron-down"/>
                                                    <span>{ child.name }</span>
                                                </div>
                                            {#if child.filter !== undefined}
                                                {#if (folded.contains('rss-filter-' + child.filter.filter.name))}
                                                    <div class="tree-item-children">
                                                        {#each child.filter.items.items as item}
                                                            <div class="tree-item">
                                                                <div class="tree-item-self">
                                                                    <ItemView item={item} plugin={plugin}/>
                                                                </div>
                                                            </div>
                                                        {/each}
                                                    </div>
                                                {/if}
                                            {/if}
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                        {/each}
                    </span>
                {/if}
            </div>
        {/if}

        {#if !$sortedFeedsStore}
            <h1>No feeds configured</h1>
        {/if}

        {#if $sortedFeedsStore}
            <div class="rss-feeds-folders">

                <div class="{folded.contains('rss-folders') ? 'is-collapsed' : ''} tree-item is-clickable"
                     on:click={() => toggleFold('rss-folders')}>
                    <span class="tree-item-self is-clickable">
                        <IconComponent iconName="feather-chevron-down"/>
                        <span>{t("folders")}</span>
                    </span>
                </div>

                {#if (!folded.contains('rss-folders'))}
                    <div class="tree-item-children">

                        {#each Object.keys($sortedFeedsStore) as folder}
                            <div class="rss-folder tree-item">
                            <span class="{folded.contains(folder) ? 'is-collapsed' : ''} tree-item-self is-clickable"
                                  on:click={() => toggleFold(folder)}
                                  on:contextmenu={(e) => openMenuForFolder(e, folder)}>
                                <IconComponent iconName="feather-chevron-down"/>
                                <span>{(folder) ? folder : t("no_folder")}</span>
                            </span>

                                <div class="tree-item-children">
                                    {#if (!folded.contains(folder))}
                                        {#each $sortedFeedsStore[folder] as feed}
                                            <FeedView feed={feed} plugin={plugin}/>
                                        {/each}
                                    {/if}
                                </div>

                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

        {/if}
    </div>
{/if}
