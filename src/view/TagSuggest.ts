import {TextInputSuggest} from "../settings/suggest";
import {get} from "svelte/store";
import {tagsStore} from "../stores";

export class TagSuggest extends TextInputSuggest<string> {

    getSuggestions(inputStr: string): string[] {
        const tags = get(tagsStore);
        const lowerCaseInputStr = inputStr.toLowerCase();
        return [...tags].filter((tag) => tag.contains(lowerCaseInputStr));
    }

    renderSuggestion(tag: string, el: HTMLElement): void {
        el.setText(tag);
    }

    selectSuggestion(tag: string): void {
        this.inputEl.value = tag;
        this.inputEl.trigger("input");
        this.close();
    }
}
