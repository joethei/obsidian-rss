<script lang="ts">
    import {filteredItemsStore, sortedFeedsStore} from "../stores";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";
    import ItemView from "./ItemView.svelte";
    import FeedView from "./FeedView.svelte";

    export let plugin: RssReaderPlugin;

    let foldedState: Map<string, boolean> = new Map();

    function toggleFold(folder: string) {
        foldedState.set(folder, !foldedState.get(folder));
        foldedState = foldedState;
    }


</script>

{#if $filteredItemsStore}
    <div class="rss-filtered-folders">

        <div class="{foldedState.get('rss-filters') ? 'is-collapsed' : ''}" on:click={() => toggleFold('rss-filters')}>
            <IconComponent iconName="right-triangle"/>
            <span>Filtered Folders</span>
        </div>

        {#if (!foldedState.get('rss-filters'))}
            {#each Object.entries($filteredItemsStore) as [key, folder]}
                <div class="{foldedState.get('rss-filter' + folder.filter.name) ? 'is-collapsed' : ''}"
                     on:click={() => toggleFold('rss-filter' + folder.filter.name)}
                     style="margin-left: 20px">
                    <IconComponent iconName="right-triangle"/>
                    <span>{ folder.filter.name }</span>
                </div>
                {#if (!foldedState.get('rss-filter' + folder.filter.name))}
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

        <div class="{foldedState.get('rss-folders') ? 'is-collapsed' : ''}" on:click={() => toggleFold('rss-folders')}>
            <IconComponent iconName="right-triangle"/>
            <span>Folders</span>
        </div>

        {#if (!foldedState.get('rss-folders'))}
            {#each Object.keys($sortedFeedsStore) as folder}

                <div class="rss-folder" style="margin-left: 20px">

                    <div class="{foldedState.get(folder) ? 'is-collapsed' : ''}" on:click={() => toggleFold(folder)}>
                        <IconComponent iconName="right-triangle"/>
                        <span>{(folder !== "undefined") ? folder : 'No Folder'}</span>
                    </div>

                    {#if (!foldedState.get(folder))}
                        {#each $sortedFeedsStore[folder] as feed}
                            <FeedView feed={feed} plugin={plugin}/>
                        {/each}
                    {/if}

                </div>
            {/each}
        {/if}
    </div>

{/if}
