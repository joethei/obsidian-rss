import {TextInputSuggest} from "../settings/suggest";
import {App} from "obsidian";

export class ArraySuggest extends TextInputSuggest<string> {

    content: Set<string>;

    constructor(app : App, input: HTMLInputElement, content: Set<string>) {
        super(app, input);
        this.content = content;
    }

    getSuggestions(inputStr: string): string[] {
        const lowerCaseInputStr = inputStr.toLowerCase();
        return [...this.content].filter((content) => content.contains(lowerCaseInputStr));
    }

    renderSuggestion(content: string, el: HTMLElement): void {
        el.setText(content);
    }

    selectSuggestion(content: string): void {
        this.inputEl.value = content;
        this.inputEl.trigger("input");
        this.close();
    }
}
