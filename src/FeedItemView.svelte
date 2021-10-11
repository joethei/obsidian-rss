<script lang="ts">
    import {FeedItem} from "feedme";
    import {FeedItemModal} from "./FeedItemModal";
    import {App} from "obsidian";

    export let app: App;
    export let item: FeedItem;

</script>

<li>
    <a on:click={() => new FeedItemModal(app, item).open()}>
        {item.title}
    </a>

</li>

