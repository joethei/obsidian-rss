<script lang="ts">
    import {sortedFeedsStore} from "./stores";
    import SingleFeedView from "./SingleFeedView.svelte";
    import RssReaderPlugin from "./main";
    import IconComponent from "./IconComponent.svelte";

    export let plugin: RssReaderPlugin;

    let foldedState: Map<string, boolean> = new Map();

    function toggleFold(folder: string) {
        foldedState.set(folder, !foldedState.get(folder));
        foldedState = foldedState;
    }


</script>

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
                        <SingleFeedView content={feed.content} plugin={plugin}/>
                    {/each}
                {/if}

            </div>

        {/each}

    </div>


{/if}

