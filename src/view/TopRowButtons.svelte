<script lang="ts">
    import {Setting} from "obsidian";
    import t from "../l10n/locale";
    import RssReaderPlugin from "../main";

    export let plugin: RssReaderPlugin;

    const buttons = (node: HTMLElement, plugin: RssReaderPlugin) => {
        new Setting(node).addExtraButton(button => {
           button
               .setIcon("refresh-cw")
               .setTooltip(t("refresh_feeds"))
               .onClick(async () => {
                   await plugin.updateFeeds();
               });
        });
    }

</script>

<span use:buttons={plugin}></span>
