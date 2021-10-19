<script lang="ts">
    import {getFeedItems} from "./rssParser";
    import FeedItemView from "./FeedItemView.svelte";
    import {RssFeed} from "./settings";
    import {App} from "obsidian";

    //@ts-ignore
    import {CollapsibleCard} from 'svelte-collapsible';


    export let feed: RssFeed = null;
    export let app: App;

    $: content = getFeedItems(feed);

</script>

{#await content}
    <p>...loading</p>
{:then content}
    <CollapsibleCard>
        <div slot="header">
            <h2>
                {#if (content.image)}
                    <img src={content.image} alt={content.title} style="width: 5%"/>
                {/if}
                { content.title }
            </h2>
            {#if content.subtitle}
                <p>{ content.subtitle }</p>
            {/if}
        </div>

        <div slot="body">
            <ul>
                {#each content.items as item}
                    <FeedItemView item={item} app={app}/>
                {/each}
            </ul>
        </div>
    </CollapsibleCard>
{/await}

