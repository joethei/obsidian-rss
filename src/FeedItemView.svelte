<script lang="ts">
    import {FeedItemModal} from "./FeedItemModal";
    import {App} from "obsidian";
    import {RssFeedItem} from "./rssParser";

    export let app: App;
    export let item: RssFeedItem;

</script>

<li>
    <a on:click={() => new FeedItemModal(app, item).open()}>
        {item.title}
    </a>

</li>

