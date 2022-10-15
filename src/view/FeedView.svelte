<script lang="ts">
    import ItemView from "./ItemView.svelte";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";
    import {Menu} from "obsidian";
    import Action from "../actions/Action";
    import {foldedState} from "../stores";
    import t from "../l10n/locale";
    import {TagModal} from "../modals/TagModal";
    import {Feed} from "../providers/Feed";
    import {Item} from "../providers/Item";

    export let feed: Feed = null;
    export let plugin: RssReaderPlugin;

    let folded: string[] = [];
    foldedState.subscribe(value => {
        folded = value;
    });

    let items: Item[] = [];
    plugin.providers.getCurrent().items().then(_items => {
        items = _items.filter(item => item.feedId() === feed.id());
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
        const menu = new Menu();

        menu.addItem((menuItem) => {
            menuItem
                .setIcon("create-new")
                .setTitle(t("create_all"))
                .onClick(async () => {
                    for (let item of items) {
                        await Action.CREATE_NOTE.processor(plugin, item);
                    }
                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setIcon("feather-eye")
                .setTitle(t("mark_all_as_read"))
                .onClick(async () => {
                    for (let item of items) {
                        item.markRead(true);
                    }

                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setIcon("tag-glyph")
                .setTitle(t("add_tags_to_all"))
                .onClick(async () => {
                    const tagModal = new TagModal(plugin, []);
                    tagModal.onClose = async () => {
                        for (let item of items) {
                            item.tags().push(...tagModal.tags);
                        }
                    };
                    tagModal.open();
                });
        });

        menu.showAtPosition({x: e.x, y: e.y});
    }

</script>

{#if !feed}
    <p>...loading</p>
{:else}

    <div class="rss-feed">
        <div class="{folded.contains(feed.title()) ?  'is-collapsed' : ''} tree-item-self is-clickable" on:click={() => toggleFold(feed.name)}
             on:contextmenu={openMenu}>
            <div class="rss-feed-title" style="overflow: hidden">
                {#if folded.contains(feed.title())}
                    <IconComponent iconName="right-chevron-glyph"/>
                {:else}
                    <IconComponent iconName="down-chevron-glyph"/>
                {/if}
                <span>
                    {feed.title()}
                    {#if (feed.favicon())}
                        <img src={feed.favicon()} alt={feed.title} style="height: 1em;"/>
                    {/if}
                </span>
            </div>
            <span class="rss-item-count">{ items.filter(item => !item.read).length }</span>
        </div>

        <div class="rss-feed-items">
            {#if !folded.contains(feed.title())}
                <div class="tree-item-children">
                    {#each items as item}
                        <div class="tree-item">
                            <div class="tree-item-self">
                                <ItemView item={item} plugin={plugin} items={items}/>
                            </div>
                        </div>
                    {/each}
                </div>

            {/if}
        </div>

    </div>

{/if}
