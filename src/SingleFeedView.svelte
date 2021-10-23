<script lang="ts">
    import {getFeedItems} from "./rssParser";
    import FeedItemView from "./FeedItemView.svelte";
    import {RssFeed} from "./settings";
    import CollapseIndicator from "./CollapseIndicator.svelte";
    import RssReaderPlugin from "./main";


    export let feed: RssFeed = null;
    export let plugin: RssReaderPlugin;

    let foldedState: Map<string, boolean> = new Map();

    function toggleFold(feed: string) {
        foldedState.set(feed, !foldedState.get(feed));
        foldedState = foldedState;
    }

    $: content = getFeedItems(feed);

</script>

{#await content}
    <p>...loading</p>
{:then content}

    <div class="rss-feed" style="margin-left: 20px">
        <div class="{foldedState.get(feed.name) ? 'is-collapsed' : ''}" on:click={() => toggleFold(feed.name)} >
            <div class="rss-feed-title" style="overflow: hidden">
                <CollapseIndicator/>
                <div style="float: left">
                    {content.title}
                    {#if (content.image)}
                        <img src={content.image} alt={content.title} style="width: 3%"/>
                    {/if}
                </div>
            </div>
        </div>

        <div class="rss-feed-items">
            {#if !foldedState.get(feed.name)}
                {#each content.items as item}
                    <FeedItemView item={item} plugin={plugin}/>
                {/each}
            {/if}
        </div>

    </div>

{/await}

