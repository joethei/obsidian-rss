<script lang="ts">

    import {htmlToMarkdown, MarkdownRenderer} from "obsidian";
    import RssReaderPlugin from "../main";

    export let content: String = "";
    export let plugin: RssReaderPlugin;


    const html = (node: HTMLElement, content: string) => {
        MarkdownRenderer.renderMarkdown(htmlToMarkdown(content), node, "", plugin);
    }

</script>

{#if content.length > 0}
    <p use:html={content}></p>
{/if}
