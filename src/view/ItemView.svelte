<script lang="ts">
    import {RssFeedItem} from "../parser/rssParser";
    import RssReaderPlugin from "../main";
    import HtmlTooltip from "./HtmlTooltip.svelte";
    import ItemTitle from "./ItemTitle.svelte";
    import {settingsStore} from "../stores";
    import MarkdownContent from "./MarkdownContent.svelte";

    export let plugin: RssReaderPlugin = null;
    export let item: RssFeedItem = null;
    export let items: RssFeedItem[] = null;

    let hover = false;

    function toggleHover() {
        hover = !hover;
    }

</script>

{#if item}
    <div class="is-clickable rss-tooltip rss-feed-item {(item.read) ? 'rss-read' : 'rss-not-read'}">
        {#if $settingsStore.displayStyle === "list"}
            <ItemTitle plugin={plugin} item={item} items={items}
                       on:mouseover={toggleHover}
                       on:mouseleave={toggleHover}
                       on:focus={toggleHover}/>

            {#if item.tags.length > 0}
            <span>
                {#each item.tags as tag}
                    &nbsp;<a class="tag rss-tag" href="#{tag}">{tag}</a>
                {/each}
            </span>
            {/if}
            {#if (hover)}
                {#if (item.description !== item.content)}
                    <HtmlTooltip content="{item.description}"/>
                {/if}
            {/if}

        {:else if $settingsStore.displayStyle === "cards"}
            <div class="rss-card is-clickable">
                <span class="rss-item-title">
                    <ItemTitle plugin={plugin} item={item} items={items}
                               on:mouseover={toggleHover}
                               on:mouseleave={toggleHover}
                               on:focus={toggleHover}/>
                    {#if item.tags.length > 0}
            <span>
                {#each item.tags as tag}
                    &nbsp;<a class="tag rss-tag" href="#{tag}">{tag}</a>
                {/each}
            </span>
            {/if}
                </span>

                <div class="rss-card-items">
                    <div class="rss-item-image">
                        {#if item.image && !item.image.includes(".mp3")}
                            <img src={item.image} width="250em" alt="Article">
                        {/if}
                    </div>
                    <div class="rss-item-text">
                        {#if item.description}
                            <MarkdownContent content={item.description}/>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
