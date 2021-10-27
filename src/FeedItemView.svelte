<script lang="ts">
    import {FeedItemModal} from "./FeedItemModal";
    import {RssFeedItem} from "./rssParser";
    import RssReaderPlugin from "./main";
    import {favoritesStore, readStore} from "./stores";
    import IconComponent from "./IconComponent.svelte";

    export let plugin: RssReaderPlugin = null;
    export let item: RssFeedItem = null;

</script>

{#if item}
    <div class="is-clickable" style="margin-left: 20px">
        <div class="rss-feed-item {($readStore.items.some(items => items.title === item.title)) ? 'rss-read' : 'rss-not-read'}">
            {#if ($favoritesStore.items.some(items => items.title === item.title))}
                <IconComponent iconName="star"/>
            {/if}
            <a on:click={() => {
                new FeedItemModal(plugin, item).open();
                    }}
            >
                {item.title}
            </a>
        </div>
    </div>

{/if}
