import {TextInputSuggest} from "../settings/suggest";
import {get} from "svelte/store";
import {folderStore} from "../stores";

export class FeedFolderSuggest extends TextInputSuggest<string> {

    getSuggestions(inputStr: string): string[] {
        const folders = get(folderStore);
        const lowerCaseInputStr = inputStr.toLowerCase();
        return [...folders].filter(folder => folder.contains(lowerCaseInputStr));
    }

    renderSuggestion(folder: string, el: HTMLElement): void {
        el.setText(folder);
    }

    selectSuggestion(folder: string): void {
        this.inputEl.value = folder;
        this.inputEl.trigger("input");
        this.close();
    }
}
