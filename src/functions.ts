import {RssFeedItem} from "./parser/rssParser";
import {htmlToMarkdown, MarkdownView, normalizePath, Notice, TextComponent} from "obsidian";
import {TextInputPrompt} from "./modals/TextInputPrompt";
import {FILE_NAME_REGEX} from "./consts";
import {isInVault} from "obsidian-community-lib";
import RssReaderPlugin from "./main";

export async function createNewNote(plugin: RssReaderPlugin, item: RssFeedItem) : Promise<void> {
    const activeFile = plugin.app.workspace.getActiveFile();
    let dir = plugin.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").name;

    if(plugin.settings.saveLocation === "custom") {
        dir = plugin.settings.saveLocationFolder;
    }
    //make sure there are no slashes in the title.
    const title = item.title.replace(/[\/\\:]/g, ' ');
    const content = htmlToMarkdown(item.content);

    const appliedTemplate = plugin.settings.template
        .replace("{{title}}", item.title)
        .replace("{{link}}", item.link)
        .replace("{{author}}", item.creator)
        .replace("{{published}}", item.pubDate)
        .replace("{{folder}}", item.folder)
        .replace("{{feed}}", item.feed)
        .replace("{{content}}", content);

    const inputPrompt = new TextInputPrompt(plugin.app, "Please specify a file name", "cannot contain: * \" \\ / < > : | ?", title, title);

    await inputPrompt
        .openAndGetValue(async (text: TextComponent) => {
            const value = text.getValue();
            if(value.match(FILE_NAME_REGEX)) {
                inputPrompt.setValidationError(text, "that filename is not valid");
                return;
            }
            const filePath = normalizePath([dir, `${value}.md`].join('/'));

            if (isInVault(plugin.app, filePath, '')) {
                inputPrompt.setValidationError(text, "there is already a note with that name");
                return;
            }
            inputPrompt.close();

            const file = await plugin.app.vault.create(filePath, appliedTemplate);

            await plugin.app.workspace.activeLeaf.openFile(file, {
                state: {mode: 'edit'},
            })
            new Notice("Created note from article");
        });
}

export async function pasteToNote(plugin: RssReaderPlugin, item: RssFeedItem) : Promise<void> {
    const file = plugin.app.workspace.getActiveFile();
    if (file === null) {
        new Notice("no file active");
        return;
    }

    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
        const editor = view.editor;
        editor.replaceRange(htmlToMarkdown(item.content), editor.getCursor());
        new Notice("inserted article into note");
    }
}

export function openInBrowser(item: RssFeedItem) : void {
    if (typeof item.link === "string") {
        window.open(item.link, '_blank');
    }
}
