<script lang="ts">
    import {favoritesStore, sortedFeedsStore} from "./stores";
    import RssReaderPlugin from "./main";
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

{#if $favoritesStore}
    <div class="rss-feeds-favorites">
        <div class="{foldedState.get('rss-fav-items') ? 'is-collapsed' : ''}" on:click={() => toggleFold('rss-fav-items')}>
            <IconComponent iconName="right-triangle"/>
            <span>Favorites</span>
        </div>

        {#if (!foldedState.get('rss-fav-items'))}
            {#each $favoritesStore.items as item}
                <ItemView item={item} plugin={plugin}/>
            {/each}
        {/if}
    </div>
{/if}

{#if !$sortedFeedsStore}
    <h1>No feeds configured</h1>
{/if}

{#if $sortedFeedsStore}

    <div class="rss-feeds-folders">
        {#each Object.keys($sortedFeedsStore) as folder}

            <div class="rss-feeds-folder">

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
    </div>

{/if}
