<!--adapted from @javalent's code: https://discord.com/channels/686053708261228577/840286264964022302/902949764209987654-->
<script lang="ts">
    import {setIcon} from "obsidian";

    export let iconName: String = "";

    const icon = (node: HTMLElement, icon: string) => {

        setIcon(node, icon);
    }

</script>

{#if iconName.length > 0}
    <span use:icon={iconName}></span>
{/if}
