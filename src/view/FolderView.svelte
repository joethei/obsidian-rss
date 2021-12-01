<script lang="ts">
    import {filteredItemsStore, foldedState, sortedFeedsStore} from "../stores";
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

</script>

{#if !folded}
    <p>Loading</p>
{:else}
    <ul>
        {#if $filteredItemsStore}
            <li class="rss-filtered-folders">
                <div class="{folded.contains('rss-filters') ? 'is-collapsed' : ''} tree-item-self is-clickable"
                     on:click={() => toggleFold('rss-filters')}>
                    <IconComponent iconName="feather-chevron-down"/>
                    <div class="tree-item-inner">{t("filtered_folders")}</div>
                </div>

                {#if (!folded.contains('rss-filters'))}
                    <ul>
                        {#each Object.entries($filteredItemsStore) as [key, folder]}
                            <li>
                                <div class="{folded.contains('rss-filters' + folder.filter.name) ? 'is-collapsed' : ''} tree-item-self is-clickable"
                                     on:click={() => toggleFold('rss-filter' + folder.filter.name)}
                                     on:contextmenu={(e) => openMenu(e, folder.items.items)}>
                                    <IconComponent iconName="feather-chevron-down"/>
                                    <span>{ folder.filter.name }</span>
                                </div>
                                {#if (folded.contains('rss-filter' + folder.filter.name))}
                                    <div>
                                        <ul>
                                            {#each folder.items.items as item}
                                                <ItemView item={item} plugin={plugin}/>
                                            {/each}
                                        </ul>
                                    </div>

                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {/if}

        {#if !$sortedFeedsStore}
            <h1>No feeds configured</h1>
        {/if}

        {#if $sortedFeedsStore}
            <li class="rss-feeds-folders">

                <p class="{folded.contains('rss-folders') ? 'is-collapsed' : ''}"
                   on:click={() => toggleFold('rss-folders')}>
                    <IconComponent iconName="feather-chevron-down"/>
                    <span>{t("folders")}</span>
                </p>

                {#if (!folded.contains('rss-folders'))}
                    <ul>
                        {#each Object.keys($sortedFeedsStore) as folder}
                            <li class="rss-folder">

                                <p class="{folded.contains(folder) ? 'is-collapsed' : ''}"
                                   on:click={() => toggleFold(folder)}
                                   on:contextmenu={(e) => openMenuForFolder(e, folder)}>
                                    <IconComponent iconName="feather-chevron-down"/>
                                    <span>{(folder !== "undefined") ? folder : 'No Folder'}</span>
                                </p>

                                {#if (!folded.contains(folder))}
                                    <ul>
                                        {#each $sortedFeedsStore[folder] as feed}
                                            <FeedView feed={feed} plugin={plugin}/>
                                        {/each}
                                    </ul>
                                {/if}

                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>

        {/if}
    </ul>
{/if}
