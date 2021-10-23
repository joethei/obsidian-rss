<script lang="ts">
    import {FeedItemModal} from "./FeedItemModal";
    import {RssFeedItem} from "./rssParser";
    import RssReaderPlugin from "./main";

    export let plugin: RssReaderPlugin;
    export let item: RssFeedItem;

</script>

<div class="is-clickable" style="margin-left: 20px">
    <div class="rss-feed-item">
        <a on:click={() => new FeedItemModal(plugin, item).open()}>
            {item.title}
        </a>
    </div>
</div>



