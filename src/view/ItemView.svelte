<script lang="ts">
    import {ItemModal} from "../modals/ItemModal";
    import {RssFeedItem} from "../parser/rssParser";
    import RssReaderPlugin from "../main";
    import IconComponent from "./IconComponent.svelte";
    import {Menu} from "obsidian";
    import {createNewNote, openInBrowser, pasteToNote} from "../functions";
    import Action from "../actions/Action";
    import HtmlTooltip from "./HtmlTooltip.svelte";

    export let plugin: RssReaderPlugin = null;
    export let item: RssFeedItem = null;

    let hover = false;

    function toggleHover() {
        hover = !hover;
    }


    async function openMenu(e: MouseEvent): Promise<void> {
        if (e.ctrlKey && e.altKey) {
            openInBrowser(item);
            return;
        }

        if (e.ctrlKey) {
            await createNewNote(plugin, item);
            return;
        }
        if (e.altKey) {
            await pasteToNote(plugin, item);
            return;
        }

        const menu = new Menu(plugin.app);


        Action.actions.forEach((action) => {
            menu.addItem((menuItem) => {
                menuItem
                    .setIcon(action.icon)
                    .setTitle(action.name)
                    .onClick(async () => {
                        await action.processor(plugin, item);
                    });
            });
        });

        menu.showAtPosition({x: e.x, y: e.y});
    }

</script>

{#if item}
    <div class="is-clickable rss-tooltip" style="margin-left: 20px">
        <div class="rss-feed-item {(item.read) ? 'rss-read' : 'rss-not-read'}">
            {#if (item.favorite)}
                <IconComponent iconName="star"/>
            {/if}
            {#if (item.created)}
                <IconComponent iconName="document"/>
            {/if}
            <a on:click={() => {
                new ItemModal(plugin, item).open();
                    }}
               on:contextmenu={openMenu}
               on:mouseover={toggleHover}
               on:mouseleave={toggleHover}
            >
                {item.title}
            </a>

            <span>
            {#each item.tags as tag}
                &nbsp;<a class="tag rss-tag">{tag}</a>
            {/each}
            </span>
        </div>
        {#if (hover)}
            {#if (item.description !== item.content)}
                <HtmlTooltip content="{item.description}"/>
            {/if}
        {/if}
    </div>

{/if}
