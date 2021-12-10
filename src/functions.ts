import {RssFeedItem} from "./parser/rssParser";
import {htmlToMarkdown, MarkdownView, normalizePath, Notice, TextComponent, moment} from "obsidian";
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

    let filename = applyTemplate(item, plugin.settings.defaultFilename, plugin.settings);
    //make sure there are no slashes in the title.
    filename = filename.replace(/[\/\\:]/g, ' ');

    if(plugin.settings.askForFilename) {
        const inputPrompt = new TextInputPrompt(plugin.app, t("specify_name"), t("cannot_contain") + " * \" \\ / < > : | ?", filename, filename);
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
        const replacedTitle = filename.replace(FILE_NAME_REGEX, '');
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
    let result = template.replace(/{{title}}/g, item.title);
    result = result.replace(/{{link}}/g, item.link);
    result = result.replace(/{{author}}/g, item.creator);
    result = result.replace(/{{published}}/g, moment(item.pubDate).format(settings.dateFormat));
    result = result.replace(/{{date}}/g, moment().format(settings.dateFormat));
    result = result.replace(/{{feed}}/g, item.feed);
    result = result.replace(/{{folder}}/g, item.folder);
    result = result.replace(/{{description}}/g, item.description);
    result = result.replace(/{{media}}/g, item.enclosure);

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

    result = result.replace(/{{tags}}/, item.tags.join(", "));
    result = result.replace(/{{#tags}}/, item.tags.map(i => '#' + i).join(", "));
    if(filename) {
        result = result.replace(/{{filename}}/g, filename);
        result = result.replace(/{{created}}/g, moment().format(settings.dateFormat));
    }

    let content = htmlToMarkdown(item.content);

    /*
    fixes #48
    replacing $ with $$$, because that is a special regex character:
    https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/string/replace#specifying_a_string_as_a_parameter
    solution taken from: https://stackoverflow.com/a/22612228/5589264
    */
    content = content.replace(/\$/g, "$$$");

    result = result.replace(/{{content}}/g, content);

    return result;
}

export function openInBrowser(item: RssFeedItem) : void {
    if (typeof item.link === "string") {
        window.open(item.link, '_blank');
    }
}
