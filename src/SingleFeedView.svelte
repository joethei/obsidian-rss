<script lang="ts">
    import {RssFeedContent} from "./rssParser";
    import FeedItemView from "./FeedItemView.svelte";
    import RssReaderPlugin from "./main";
    import IconComponent from "./IconComponent.svelte";

    export let content: RssFeedContent = null;
    export let plugin: RssReaderPlugin;

    let foldedState: Map<string, boolean> = new Map();

    function toggleFold(feed: string) {
        foldedState.set(feed, !foldedState.get(feed));
        foldedState = foldedState;
    }

</script>

{#if !content}
    <p>...loading</p>
{:else}

    <div class="rss-feed" style="margin-left: 20px">
        <div class="{foldedState.get(content.title) ? 'is-collapsed' : ''}" on:click={() => toggleFold(content.title)} >
            <div class="rss-feed-title" style="overflow: hidden">
                <IconComponent iconName="right-triangle"/>
                <span>
                    {content.title}
                    {#if (content.image)}
                        <img src={content.image} alt={content.title} style="width: 3%"/>
                    {/if}
                </span>
            </div>
        </div>

        <div class="rss-feed-items">
            {#if !foldedState.get(content.title)}
                {#each content.items as item}
                    <FeedItemView item={item} plugin={plugin}/>
                {/each}
            {/if}
        </div>

    </div>

{/if}
