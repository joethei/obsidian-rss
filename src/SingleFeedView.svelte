<script lang="ts">
    import {listFeedItems} from "./rssParser";
    import FeedItemView from "./FeedItemView.svelte";
    import {RssFeed} from "./settings";
    import {App} from "obsidian";

    export let feed: RssFeed = null;
    export let app: App;

    $: content = listFeedItems(feed);
</script>

{#await content}
    <p>...loading</p>
{:then content}
    <h2>{ content.title }</h2>
    <ul>
        {#each content.items as item}
            <FeedItemView item={item} app={app}/>
        {/each}
    </ul>
{/await}

