import {
    htmlToMarkdown,
    MarkdownView,
    normalizePath,
    Notice,
    TextComponent,
    MarkdownPreviewRenderer, moment, View, TextFileView
} from "obsidian";
import {TextInputPrompt} from "./modals/TextInputPrompt";
import {FILE_NAME_REGEX} from "./consts";
import RssReaderPlugin from "./main";
import t from "./l10n/locale";
import {Item} from "./providers/Item";

export async function createNewNote(plugin: RssReaderPlugin, item: Item): Promise<void> {
    console.log("creating new note");
    const activeFile = plugin.app.workspace.getActiveFile();
    let dir = plugin.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").path;

    if (plugin.settings.saveLocation === "custom") {
        dir = plugin.settings.saveLocationFolder;
    }

    let filename = applyTemplate(plugin, item, plugin.settings.defaultFilename);
    //make sure there are no slashes in the title.
    filename = filename.replace(/[\/\\:]/g, ' ');

    if (plugin.settings.askForFilename) {
        const inputPrompt = new TextInputPrompt(plugin.app, t("specify_name"), t("cannot_contain") + " * \" \\ / < > : | ?", filename, filename);
        await inputPrompt
            .openAndGetValue(async (text: TextComponent) => {
                const value = text.getValue();
                if (value.match(FILE_NAME_REGEX)) {
                    inputPrompt.setValidationError(text, t("invalid_filename"));
                    return;
                }
                const filePath = normalizePath([dir, `${value}.md`].join('/'));

                if (isInVault(filePath)) {
                    inputPrompt.setValidationError(text, t("note_exists"));
                    return;
                }
                inputPrompt.close();
                await createNewFile(plugin, item, filePath, value);
            });
    } else {
        const replacedTitle = filename.replace(FILE_NAME_REGEX, '');
        const filePath = normalizePath([dir, `${replacedTitle}.md`].join('/'));
        await createNewFile(plugin, item, filePath, item.title());
    }


}

async function createNewFile(plugin: RssReaderPlugin, item: Item, path: string, title: string) {
    if (isInVault(path)) {
        new Notice(t("note_exists"));
        return;
    }

    const appliedTemplate = applyTemplate(plugin, item, plugin.settings.template, title);

    const file = await plugin.app.vault.create(path, appliedTemplate);
    await plugin.app.workspace.getLeaf('tab').openFile(file, {
        state: {mode: 'edit'},
    });

    item.markCreated(true);
    const items = plugin.settings.items;
    await plugin.writeFeedContent(() => {
        return items;
    });

    new Notice(t("created_note"));
}

export async function pasteToNote(plugin: RssReaderPlugin, item: Item): Promise<void> {
    const file = plugin.app.workspace.getActiveFile();
    if (file === null) {
        new Notice(t("no_file_active"));
        return;
    }

    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    console.log(view);
    if (view) {
        const appliedTemplate = applyTemplate(plugin, item, plugin.settings.pasteTemplate);

        const editor = view.editor;
        editor.replaceRange(appliedTemplate, editor.getCursor());

        item.markCreated(true);
        const items = plugin.settings.items;
        await plugin.writeFeedContent(() => {
            return items;
        });

        new Notice(t("RSS_Reader") + t("inserted_article"));
    }else {
        new Notice("No view available");
    }
}

function applyTemplate(plugin: RssReaderPlugin, item: Item, template: string, filename?: string): string {
    let result = template.replace(/{{title}}/g, item.title());
    result = result.replace(/{{link}}/g, item.url());
    result = result.replace(/{{author}}/g, item.author());
    result = result.replace(/{{published}}/g, moment(item.pubDate()).format(plugin.settings.dateFormat));
    result = result.replace(/{{created}}/g, moment().format(plugin.settings.dateFormat));
    result = result.replace(/{{date}}/g, moment().format(plugin.settings.dateFormat));
    result = result.replace(/{{feed}}/g, item.feed());
    result = result.replace(/{{folder}}/g, item.folder());
    result = result.replace(/{{description}}/g, item.description());
    result = result.replace(/{{media}}/g, item.enclosureLink);

    result = result.replace(/({{published:).*(}})/g, function (k) {
        const value = k.split(":")[1];
        const format = value.substring(0, value.indexOf("}"));
        return moment(item.pubDate()).format(format);
    });

    result = result.replace(/({{created:).*(}})/g, function (k) {
        const value = k.split(":")[1];
        const format = value.substring(0, value.indexOf("}"));
        return moment().format(format);
    });

    result = result.replace(/({{tags:).*(}})/g, function (k) {
        const value = k.split(":")[1];
        const separator = value.substring(0, value.indexOf("}"));
        return item.tags().join(separator);
    });

    result = result.replace(/({{#tags:).*(}})/g, function (k) {
        const value = k.split(":")[1];
        const separator = value.substring(0, value.indexOf("}"));
        return item.tags().map(i => '#' + i).join(separator);
    });

    result = result.replace(/{{tags}}/g, item.tags().join(", "));
    result = result.replace(/{{#tags}}/g, item.tags().map(i => '#' + i).join(", "));



    result = result.replace(/{{highlights}}/g, item.highlights().map(value => {
        //remove wallabag.xml - from the start of a highlight
        return "- " + rssToMd(plugin, removeFormatting(value).replace(/^(-+)/, ""))
    }).join("\n"));

    result = result.replace(/({{highlights:)[\s\S][^}]*(}})/g, function (k) {
        const value = k.split(/(:[\s\S]?)/);
        const tmp = value.slice(1).join("");
        const template = tmp.substring(1, tmp.indexOf("}"));
        return item.highlights().map(i => {
            return template.replace(/%%highlight%%/g, rssToMd(plugin, removeFormatting(i)).replace(/^(-+)/, ""));
        }).join("");
    });

    if (filename) {
        result = result.replace(/{{filename}}/g, filename);
    }


    let content = rssToMd(plugin, item.body());

    item.highlights().forEach(highlight => {
        const mdHighlight = htmlToMarkdown(highlight);
        content = content.replace(mdHighlight, "==" + mdHighlight + "==");


    });
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

function removeFormatting(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll("html body a");
    for (let i = 0; i < elements.length; i++) {
        const el = elements.item(i) as HTMLAnchorElement;
        if (el.dataset) {
            Object.keys(el.dataset).forEach(key => {
                delete el.dataset[key];
            });
        }
    }

    const objects = doc.querySelectorAll("object");
    for (let i = 0; i < objects.length; i++) {
        const object = objects.item(i) as HTMLObjectElement;
        object.remove();
    }

    return doc.documentElement.innerHTML;
}

export function openInBrowser(item: Item): void {
    if (typeof item.url() === "string") {
        window.open(item.url(), '_blank');
    }
}

export function rssToMd(plugin: RssReaderPlugin, content: string): string {

    let markdown = htmlToMarkdown(content);

    //If dataview is installed
    if ((plugin.app as any).plugins.plugins["dataview"]) {
        //wrap dataview inline code
        const {
            inlineQueryPrefix,
            inlineJsQueryPrefix
        } = (plugin.app as any).plugins.plugins.dataview.api.settings as { [key: string]: string };
        markdown = markdown.replace(RegExp(`\`${escapeRegExp(inlineQueryPrefix)}.*\``, 'g'), "<pre>$&</pre>");
        markdown = markdown.replace(RegExp(`\`${escapeRegExp(inlineJsQueryPrefix)}.*\``, 'g'), "<pre>$&</pre>");
    }

    //If templater is installed
    if ((plugin.app as any).plugins.plugins["templater-obsidian"]) {
        //wrap templater commands
        markdown = markdown.replace(/<%([\s\S]*?)%>/g, "```javascript\n$&\n```");
    }

    //wrap wallabag.xml codeblocks where there is a processor registered.
    //as codeblockProcessors is not exposed publicly(and seems to be only existent after v.13) do a check first
    //@ts-ignore
    if (MarkdownPreviewRenderer.codeBlockPostProcessors) {
        //@ts-ignore
        const codeblockProcessors: string[] = Object.keys(MarkdownPreviewRenderer.codeBlockPostProcessors);
        for (const codeblockProcessor of codeblockProcessors) {
            const regex = RegExp("^```" + codeblockProcessor + "\[\\s\\S\]*?```$", "gm");
            markdown = markdown.replace(regex, "<pre>$&</pre>");
        }
    } else {
        //just remove wallabag.xml codeblocks instead
        markdown = markdown.replace(/^```.*\n([\s\S]*?)```$/gm, "<pre>$&</pre>");
    }

    if (!plugin.settings.displayMedia) {
        //remove any embeds, but keep alias
        markdown = markdown.replace(/!?\[(.*)\]\(.+\)/gm, "$1");
    }
    return markdown;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

//the code below is taken from https://github.com/obsidian-community/obsidian-community-lib
function isInVault(noteName: string, sourcePath: string = ""): boolean {
    return !!app.metadataCache.getFirstLinkpathDest(noteName, sourcePath);
}

/**
 * Copy `content` to the users clipboard.
 *
 * @param {string} content The content to be copied to clipboard.
 * @param {() => any} success The callback to run when text is successfully copied. Default throws a new `Notice`
 * @param {(reason?) => any} failure The callback to run when text was not able to be copied. Default throws a new `Notice`, and console logs the error.`
 */
export async function copy(
    content: string,
    success: () => any = () => new Notice("Copied to clipboard"),
    failure: (reason?: any) => any = (reason) => {
        new Notice("Could not copy to clipboard");
        console.log({reason});
    }
) {
    await navigator.clipboard.writeText(content).then(success, failure);
}
