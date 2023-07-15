import {AbstractTextComponent, Modal} from "obsidian";

export class BaseModal extends Modal {

    //taken from github.com/valentine195/obsidian-admonition
    setValidationError(input: AbstractTextComponent<any>, message?: string) : void {
        input.inputEl.addClass("is-invalid");
        if (message) {
            input.inputEl.parentElement.addClasses([
                "has-invalid-message",
                "unset-align-items"
            ]);
            input.inputEl.parentElement.addClass(
                ".unset-align-items"
            );
            let mDiv = input.inputEl.parentElement.querySelector(
                ".invalid-feedback"
            ) as HTMLDivElement;

            if (!mDiv) {
                mDiv = createDiv({ cls: "invalid-feedback" });
            }
            mDiv.innerText = message;
            mDiv.insertAfter(input.inputEl);
        }
    }

    removeValidationError(input: AbstractTextComponent<any>) : void {
        input.inputEl.removeClass("is-invalid");
        input.inputEl.parentElement.removeClasses([
            "has-invalid-message",
            "unset-align-items"
        ]);
        input.inputEl.parentElement.parentElement.removeClass(
            ".unset-align-items"
        );

        if (
            input.inputEl.parentElement.querySelector(".invalid-feedback")
        ) {
            input.inputEl.parentElement.removeChild(
                input.inputEl.parentElement.querySelector(
                    ".invalid-feedback"
                )
            );
        }
    }
}
