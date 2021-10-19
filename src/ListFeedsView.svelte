<script lang="ts">
    import {settingsWrit} from "./stores";
    import SingleFeedView from "./SingleFeedView.svelte";
    import {App} from "obsidian";
    import groupBy from "lodash.groupby";
    //@ts-ignore
    import { CollapsibleCard } from 'svelte-collapsible';

    export let app: App;

    $: sortedFeeds = groupBy($settingsWrit.feeds, 'folder');
    $: console.log(sortedFeeds);

</script>

{#if sortedFeeds}
    {#each Object.keys(sortedFeeds) as folder}
        <CollapsibleCard>
            <h1 slot="header">{(folder !== "undefined") ? folder : 'No Folder'}</h1>
            <div slot="body">
                {#each sortedFeeds[folder] as feed}
                    <SingleFeedView feed={feed} app={app}/>
                {/each}
            </div>
        </CollapsibleCard>
    {/each}


{/if}

