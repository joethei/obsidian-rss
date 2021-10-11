<script lang="ts">
    import {settingsWrit} from "./stores";
    import SingleFeedView from "./SingleFeedView.svelte";
    import {App} from "obsidian";

    export let app: App;

</script>

<h1>RSS Feeds</h1>

{#if $settingsWrit.feeds}
    {#each $settingsWrit.feeds as feed}
        <SingleFeedView feed={feed} app={app}/>
    {/each}

{/if}

