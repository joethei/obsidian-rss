<script lang="ts">
    import RssReaderPlugin from "../main";
    import HtmlTooltip from "./HtmlTooltip.svelte";
    import ItemTitle from "./ItemTitle.svelte";
    import {settingsStore} from "../stores";
    import MarkdownContent from "./MarkdownContent.svelte";
    import {Item} from "../providers/Item";

    export let plugin: RssReaderPlugin = null;
    export let item: Item = null;
    export let items: Item[] = null;

    let hover = false;

    function toggleHover() {
        hover = !hover;
    }

</script>

{#if item}
    <div class="is-clickable rss-tooltip rss-fee d-item {(item.read()) ? 'rss-read' : 'rss-not-read'}">
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
                {#if (item.mediaDescription() !== item.body())}
                    <HtmlTooltip content="{item.mediaDescription()}"/>
                {/if}
            {/if}

        {:else if $settingsStore.displayStyle === "cards"}
            <div class="rss-card is-clickable">
                <span class="rss-item-title">
                    <ItemTitle plugin={plugin} item={item} items={items}
                               on:mouseover={toggleHover}
                               on:mouseleave={toggleHover}
                               on:focus={toggleHover}/>
                    {#if item.tags().length > 0}
                        <span>
                            {#each item.tags() as tag}
                                &nbsp;<a class="tag rss-tag" href="#{tag}">{tag}</a>
                            {/each}
                        </span>
                    {/if}
                </span>

                <div class="rss-card-items">
                    <div class="rss-item-image">
                        {#if item.mediaThumbnail() && !item.mediaThumbnail().includes(".mp3")}
                            <img src={item.mediaThumbnail()} width="250em" alt="Article">
                        {/if}
                    </div>
                    <div class="rss-item-text">
                        {#if item.description()}
                            <MarkdownContent content={item.description()}/>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
