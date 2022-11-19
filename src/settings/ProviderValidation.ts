import {Setting} from "obsidian";
import {FeedProvider} from "../providers/FeedProvider";

export class ProviderValidation {
    private readonly provider: FeedProvider;
    private readonly containerEl: HTMLDivElement;

    constructor(provider: FeedProvider, containerEl: HTMLDivElement) {
        this.provider = provider;
        this.containerEl = containerEl;
    }

    public async display() {
        const isValid = await this.provider.isValid();

        new Setting(this.containerEl)
            .setName("Validate")
            .setDesc("Ensure that the service is configured properly")
            .addButton(button => {
                    button
                        .setButtonText("Test")
                        .setIcon(isValid ? "check" : "x")
                        .setClass(isValid ? "rss-test-valid" : "rss-test-invalid")
                        .onClick(async () => {
                            await this.display();
                        })
                }
            )


        if (!isValid) {
            this.containerEl.createEl("h4", {text: "Errors"});
            const list = this.containerEl.createEl("ul");
            for (const warning of this.provider.warnings()) {
                list.createEl("li", {text: warning});
            }
        }
    }
}
