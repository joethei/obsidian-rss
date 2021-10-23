<script lang="ts">
    import {settingsWritable} from "./stores";
    import SingleFeedView from "./SingleFeedView.svelte";
    import groupBy from "lodash.groupby";
    import CollapseIndicator from "./CollapseIndicator.svelte";
    import RssReaderPlugin from "./main";

    export let plugin: RssReaderPlugin;

    let foldedState: Map<string, boolean> = new Map();

    function toggleFold(folder: string) {
        foldedState.set(folder, !foldedState.get(folder));
        foldedState = foldedState;
    }

    $: sortedFeeds = groupBy($settingsWritable.feeds, 'folder');

</script>

{#if sortedFeeds}
    <div class="rss-feeds-folders">
        {#each Object.keys(sortedFeeds) as folder}

            <div class="rss-feeds-folder">

                <div class="{foldedState.get(folder) ? 'is-collapsed' : ''}" on:click={() => toggleFold(folder)}>
                    <CollapseIndicator/>
                    <span>{(folder !== "undefined") ? folder : 'No Folder'}</span>
                </div>

                {#if (!foldedState.get(folder))}
                    {#each sortedFeeds[folder] as feed}
                        <SingleFeedView feed={feed} plugin={plugin}/>
                    {/each}
                {/if}

            </div>

        {/each}

    </div>


{/if}

