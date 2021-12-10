<script lang="ts">
    import {RssFeedContent} from "../parser/rssParser";
    import ItemView from "./ItemView.svelte";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";
    import {Menu} from "obsidian";
    import Action from "../actions/Action";
    import {foldedState} from "../stores";
    import t from "../l10n/locale";

    export let feed: RssFeedContent = null;
    export let plugin: RssReaderPlugin;

    let folded: string[] = [];
    foldedState.subscribe(value => {
        folded = value;
    });

    function toggleFold(feed: string) {
        if (!folded) {
            folded = [];
        }
        if (folded.contains(feed)) {
            folded.remove(feed);
        } else folded.push(feed);
        plugin.writeFolded(folded);
    }

    async function openMenu(e: MouseEvent): Promise<void> {
        const menu = new Menu(plugin.app);

        menu.addItem((menuItem) => {
            menuItem
                .setIcon("create-new")
                .setTitle(t("create_all"))
                .onClick(async () => {
                    for (let item of feed.items) {
                        await Action.CREATE_NOTE.processor(plugin, item);
                    }
                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setIcon("feather-eye")
                .setTitle(t("mark_all_as_read"))
                .onClick(async () => {
                    for (let item of feed.items) {
                        item.read = true;
                    }
                    const items = plugin.settings.items;
                    await plugin.writeFeedContent(() => {
                        return items;
                    });
                });
        });

        menu.showAtPosition({x: e.x, y: e.y});
    }

</script>

{#if !feed}
    <p>...loading</p>
{:else}

    <div class="rss-feed">
        <div class="{folded.contains(feed.name) ?  'is-collapsed' : ''} tree-item-self is-clickable" on:click={() => toggleFold(feed.name)}
             on:contextmenu={openMenu}>
            <div class="rss-feed-title" style="overflow: hidden">
                <IconComponent iconName="feather-chevron-down"/>
                <span>
                    {feed.name}
                    {#if (feed.image)}
                        <img src={feed.image} alt={feed.title} style="height: 1em;"/>
                    {/if}
                </span>
            </div>
        </div>

        <div class="rss-feed-items">
            {#if !folded.contains(feed.name)}
                <div class="tree-item-children">
                    {#each feed.items as item}
                        <div class="tree-item">
                            <div class="tree-item-self">
                                <ItemView item={item} plugin={plugin}/>
                            </div>
                        </div>
                    {/each}
                </div>

            {/if}
        </div>

    </div>

{/if}
