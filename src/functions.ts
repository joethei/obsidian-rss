import {RssFeedItem} from "./parser/rssParser";
import {htmlToMarkdown, MarkdownView, normalizePath, Notice, TextComponent} from "obsidian";
import {TextInputPrompt} from "./modals/TextInputPrompt";
import {FILE_NAME_REGEX} from "./consts";
import {isInVault} from "obsidian-community-lib";
import RssReaderPlugin from "./main";
import {RssReaderSettings} from "./settings/settings";

export async function createNewNote(plugin: RssReaderPlugin, item: RssFeedItem) : Promise<void> {
    const activeFile = plugin.app.workspace.getActiveFile();
    let dir = plugin.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").name;

    if(plugin.settings.saveLocation === "custom") {
        dir = plugin.settings.saveLocationFolder;
    }
    //make sure there are no slashes in the title.
    const title = item.title.replace(/[\/\\:]/g, ' ');

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

            const appliedTemplate = applyTemplate(item, plugin.settings.template, plugin.settings, value);

            const file = await plugin.app.vault.create(filePath, appliedTemplate);

            await plugin.app.workspace.activeLeaf.openFile(file, {
                state: {mode: 'edit'},
            });

            item.created = true;
            const items = plugin.settings.items;
            await plugin.writeFeedContent(() => {
                return items;
            });

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
        const appliedTemplate = applyTemplate(item, plugin.settings.pasteTemplate, plugin.settings);

        const editor = view.editor;
        editor.replaceRange(htmlToMarkdown(appliedTemplate), editor.getCursor());

        item.created = true;
        const items = plugin.settings.items;
        await plugin.writeFeedContent(() => {
            return items;
        });

        new Notice("inserted article into note");
    }
}

function applyTemplate(item: RssFeedItem, template: string, settings: RssReaderSettings, filename?: string) : string {
    const content = htmlToMarkdown(item.content);

    let result = replaceAll(template, "{{title}}", item.title);
    result = replaceAll(result, "{{link}}", item.link);
    result = replaceAll(result, "{{author}}", item.creator);
    result = replaceAll(result, "{{content}}", content);
    result = replaceAll(result, "{{published}}", window.moment(item.pubDate).format(settings.dateFormat));
    result = replaceAll(result, "{{feed}}", item.feed);
    result = replaceAll(result, "{{folder}}", item.folder);
    result = replaceAll(result, "{{description}}", item.description);
    if(filename) {
        result = replaceAll(result, "{{filename}}", filename);
        result = replaceAll(result, "{{created}}", window.moment().format(settings.dateFormat));
    }

    return result;
}

export function openInBrowser(item: RssFeedItem) : void {
    if (typeof item.link === "string") {
        window.open(item.link, '_blank');
    }
}

//taken from: https://stackoverflow.com/a/1144788/5589264
function escapeRegExp(string: string) : string {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string) : string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
