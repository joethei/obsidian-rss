<script lang="ts">
    import {ItemModal} from "../modals/ItemModal";
    import {RssFeedItem} from "../parser/rssParser";
    import RssReaderPlugin from "../main";
    import {favoritesStore, readStore} from "../stores";
    import IconComponent from "./IconComponent.svelte";
    import {htmlToMarkdown, Menu} from "obsidian";
    import {createNewNote, openInBrowser, pasteToNote} from "../functions";
    import {copy} from "obsidian-community-lib";

    export let plugin: RssReaderPlugin = null;
    export let item: RssFeedItem = null;

    async function openMenu(e: MouseEvent) : Promise<void> {
        if(e.ctrlKey && e.altKey) {
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
        menu.addItem((menuItem) => {
            menuItem
                .setTitle("Add as new note")
                .setIcon("create-new")
                .onClick(async () => {
                    await createNewNote(plugin, item);
                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setTitle("paste to current note")
                .setIcon("paste")
                .onClick(async () => {
                    await pasteToNote(plugin, item);
                });
        });
        menu.addItem((menuItem) => {
            menuItem
                .setTitle("copy to clipboard")
                .setIcon("feather-clipboard")
                .onClick(async () => {
                    await copy(htmlToMarkdown(item.content));
                });
        })
        menu.addItem((menuItem) => {
            menuItem
                .setTitle("open in browser")
                .setIcon("open-elsewhere-glyph")
                .onClick(async() => {
                    openInBrowser(item);
                });
        });

        menu.showAtPosition({x: e.x, y: e.y});
    }

</script>

{#if item}
    <div class="is-clickable" style="margin-left: 20px">
        <div class="rss-feed-item {($readStore.items.some(items => items.title === item.title)) ? 'rss-read' : 'rss-not-read'}">
            {#if ($favoritesStore.items.some(items => items.title === item.title))}
                <IconComponent iconName="star"/>
            {/if}
            <a on:click={() => {
                new ItemModal(plugin, item).open();
                    }}
               on:contextmenu={openMenu}
            >
                {item.title}
            </a>
        </div>
    </div>

{/if}
