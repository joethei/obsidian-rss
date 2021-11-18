<script lang="ts">

    import {sanitizeHTMLToDom} from "../consts";

    export let content: String = "";


    const html = (node: HTMLElement, content: string) => {
        node.append(sanitizeHTMLToDom(content));
    }



</script>

{#if content.length > 0}
    <span use:html={content} class="tooltiptext"></span>
{/if}
