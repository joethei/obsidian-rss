<script lang="ts">
    import {filteredItemsStore, foldedState, sortedFeedsStore} from "../stores";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";
    import ItemView from "./ItemView.svelte";
    import FeedView from "./FeedView.svelte";
    import {Menu} from "obsidian";
    import Action from "../actions/Action";
    import {RssFeedItem} from "../parser/rssParser";

    export let plugin: RssReaderPlugin;

    let folded: string[] = [];
    foldedState.subscribe(value => {
       folded = value;
    });

    function toggleFold(folder: string) {
        if(!folded) {
            folded = [];
        }
        if(folded.contains(folder)) {
            folded.remove(folder);
        }else folded.push(folder);
        plugin.writeFolded(folded);
    }

    async function openMenuForFolder(e: MouseEvent, folder: string) : Promise<void> {
        const items: RssFeedItem[] = [];
        for(const feed of $sortedFeedsStore[folder]) {
            for (let item of feed.items) {
                items.push(item);
            }
        }
        await openMenu(e, items);
    }

    async function openMenu(e: MouseEvent, feedItems: RssFeedItem[]) : Promise<void> {
        const menu = new Menu(plugin.app);

        menu.addItem((menuItem) => {
            menuItem
                .setIcon("create-new")
                .setTitle("Create all")
                .onClick(async () => {
                    for (const item of feedItems) {
                        await Action.CREATE_NOTE.processor(plugin, item);
                    }
                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setIcon("feather-eye")
                .setTitle("Mark all as read")
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
    {#if $filteredItemsStore}
        <div class="rss-filtered-folders">

            <div class="{folded.contains('rss-filters') ? 'is-collapsed' : ''} tree-item-self is-clickable"
                 on:click={() => toggleFold('rss-filters')}>
                <IconComponent iconName="right-triangle"/>
                <div class="tree-item-inner">Filtered Folders</div>
            </div>

            {#if (!folded.contains('rss-filters'))}
                {#each Object.entries($filteredItemsStore) as [key, folder]}
                    <div class="{folded.contains('rss-filters' + folder.filter.name) ? 'is-collapsed' : ''}"
                         on:click={() => toggleFold('rss-filter' + folder.filter.name)}
                         on:contextmenu={(e) => openMenu(e, folder.items.items)}
                         style="margin-left: 20px">
                        <IconComponent iconName="right-triangle"/>
                        <span>{ folder.filter.name }</span>
                    </div>
                    {#if (folded.contains('rss-filter' + folder.filter.name))}
                        <div style="margin-left: 20px">
                            {#each folder.items.items as item}
                                <ItemView item={item} plugin={plugin}/>
                            {/each}
                        </div>

                    {/if}
                {/each}
            {/if}
        </div>
    {/if}

    {#if !$sortedFeedsStore}
        <h1>No feeds configured</h1>
    {/if}

    {#if $sortedFeedsStore}
        <div class="rss-feeds-folders">

            <div class="{folded.contains('rss-folders') ? 'is-collapsed' : ''}" on:click={() => toggleFold('rss-folders')}>
                <IconComponent iconName="right-triangle"/>
                <span>Folders</span>
            </div>

            {#if (!folded.contains('rss-folders'))}
                {#each Object.keys($sortedFeedsStore) as folder}

                    <div class="rss-folder" style="margin-left: 20px">

                        <div class="{folded.contains(folder) ? 'is-collapsed' : ''}"
                             on:click={() => toggleFold(folder)}
                             on:contextmenu={(e) => openMenuForFolder(e, folder)}>
                            <IconComponent iconName="right-triangle"/>
                            <span>{(folder !== "undefined") ? folder : 'No Folder'}</span>
                        </div>

                        {#if (!folded.contains(folder))}
                            {#each $sortedFeedsStore[folder] as feed}
                                <FeedView feed={feed} plugin={plugin}/>
                            {/each}
                        {/if}

                    </div>
                {/each}
            {/if}
        </div>

    {/if}

{/if}
