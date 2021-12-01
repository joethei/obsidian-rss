import {RssFeedItem} from "./parser/rssParser";
import {htmlToMarkdown, MarkdownView, normalizePath, Notice, TextComponent} from "obsidian";
import {TextInputPrompt} from "./modals/TextInputPrompt";
import {FILE_NAME_REGEX} from "./consts";
import {isInVault} from "obsidian-community-lib";
import RssReaderPlugin from "./main";
import {RssReaderSettings} from "./settings/settings";
import t from "./l10n/locale";

export async function createNewNote(plugin: RssReaderPlugin, item: RssFeedItem) : Promise<void> {
    const activeFile = plugin.app.workspace.getActiveFile();
    let dir = plugin.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").path;

    if(plugin.settings.saveLocation === "custom") {
        dir = plugin.settings.saveLocationFolder;
    }
    //make sure there are no slashes in the title.
    const title = item.title.replace(/[\/\\:]/g, ' ');

    const inputPrompt = new TextInputPrompt(plugin.app, t("specify_name"), t("cannot_contain") + " * \" \\ / < > : | ?", title, title);
    if(plugin.settings.askForFilename) {
        await inputPrompt
            .openAndGetValue(async (text: TextComponent) => {
                const value = text.getValue();
                if(value.match(FILE_NAME_REGEX)) {
                    inputPrompt.setValidationError(text, t("invalid_filename"));
                    return;
                }
                const filePath = normalizePath([dir, `${value}.md`].join('/'));

                if (isInVault(plugin.app, filePath, '')) {
                    inputPrompt.setValidationError(text, t("note_exists"));
                    return;
                }
                inputPrompt.close();
                await createNewFile(plugin, item, filePath, value);
            });
    }else {
        const replacedTitle = item.title.replace(FILE_NAME_REGEX, '');
        const filePath = normalizePath([dir, `${replacedTitle}.md`].join('/'));
        await createNewFile(plugin, item, filePath, item.title);
    }


}

async function createNewFile(plugin: RssReaderPlugin, item: RssFeedItem, path: string, title: string) {
    if (isInVault(plugin.app, path, '')) {
        new Notice(t("note_exists"));
        return;
    }

    const appliedTemplate = applyTemplate(item, plugin.settings.template, plugin.settings, title);

    const file = await plugin.app.vault.create(path, appliedTemplate);

    await plugin.app.workspace.activeLeaf.openFile(file, {
        state: {mode: 'edit'},
    });

    item.created = true;
    const items = plugin.settings.items;
    await plugin.writeFeedContent(() => {
        return items;
    });

    new Notice(t("created_note"));
}

export async function pasteToNote(plugin: RssReaderPlugin, item: RssFeedItem) : Promise<void> {
    const file = plugin.app.workspace.getActiveFile();
    if (file === null) {
        new Notice(t("no_file_active"));
        return;
    }

    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
        const appliedTemplate = applyTemplate(item, plugin.settings.pasteTemplate, plugin.settings);

        const editor = view.editor;
        editor.replaceRange(appliedTemplate, editor.getCursor());

        item.created = true;
        const items = plugin.settings.items;
        await plugin.writeFeedContent(() => {
            return items;
        });

        new Notice(t("RSS_Reader") + t("inserted_article"));
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

    result = result.replace(/({{tags:).*(}})/g, function (k) {
        const value = k.split(":")[1];
        const separator = value.substring(0, value.indexOf("}"));
        return item.tags.join(separator);
    });

    result = result.replace(/({{#tags:).*(}})/g, function (k) {
        const value = k.split(":")[1];
        const separator = value.substring(0, value.indexOf("}"));
        return item.tags.map(i => '#' + i).join(separator);
    });

    result = replaceAll(result, "{{tags}}", item.tags.join(", "));
    result = replaceAll(result, "{{#tags}}", item.tags.map(i => '#' + i).join(", "));
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
