<script lang="ts">
    import RssReaderPlugin from "../main";
    import {RssFeedItem} from "../parser/rssParser";
    import IconComponent from "./IconComponent.svelte";
    import {ItemModal} from "../modals/ItemModal";
    import {createNewNote, openInBrowser, pasteToNote} from "../functions";
    import {Menu} from "obsidian";
    import Action from "../actions/Action";

    export let plugin: RssReaderPlugin = null;
    export let item: RssFeedItem = null;
    export let items: RssFeedItem[] = null;

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

{#if (item.favorite)}
    <IconComponent iconName="star"/>
{/if}
{#if (item.created)}
    <IconComponent iconName="document"/>
{/if}
<a on:click={() => {
                new ItemModal(plugin, item, items).open();
                    }}
   on:contextmenu={openMenu}
>
    {item.title}
</a>
