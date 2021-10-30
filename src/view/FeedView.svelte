<script lang="ts">
    import {RssFeedMap} from "../parser/rssParser";
    import ItemView from "./ItemView.svelte";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";

    export let feed: RssFeedMap = null;
    export let plugin: RssReaderPlugin;

    let foldedState: Map<string, boolean> = new Map();

    function toggleFold(feed: string) {
        foldedState.set(feed, !foldedState.get(feed));
        foldedState = foldedState;
    }

</script>

{#if !feed}
    <p>...loading</p>
{:else}

    <div class="rss-feed" style="margin-left: 20px">
        <div class="{foldedState.get(feed.feed.name) ? 'is-collapsed' : ''}" on:click={() => toggleFold(feed.feed.name)} >
            <div class="rss-feed-title" style="overflow: hidden">
                <IconComponent iconName="right-triangle"/>
                <span>
                    {feed.feed.name}
                    {#if (feed.content.image)}
                        <img src={feed.content.image} alt={feed.content.title} style="height: 1em;"/>
                    {/if}
                </span>
            </div>
        </div>

        <div class="rss-feed-items">
            {#if !foldedState.get(feed.feed.name)}
                {#each feed.content.items as item}
                    <ItemView item={item} plugin={plugin}/>
                {/each}
            {/if}
        </div>

    </div>

{/if}
