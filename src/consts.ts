export const VIEW_ID = "RSS_FEED";
export const FILE_NAME_REGEX = /["\/<>:|?]/gm;
export const TAG_REGEX = /([\p{Letter}\p{Emoji_Presentation}\p{Number}\/_-]+)/u;
export const NUMBER_REGEX = /^[0-9]*$/gm;

//TODO: remove once api definition has been updated
/**
 * taken from @licat(https://discord.com/channels/686053708261228577/840286264964022302/899037833552093184)
 * @param html
 */
export function sanitizeHTMLToDom(html: string): DocumentFragment {
    // @ts-ignore
    return window.DOMPurify.sanitize(html, {
        ALLOW_UNKNOWN_PROTOCOLS: true,
        RETURN_DOM_FRAGMENT: true,
        RETURN_DOM_IMPORT: true,
        FORBID_TAGS: ['style'],
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['frameborder', 'allowfullscreen', 'allow', 'aria-label-position'],
    });
}

//taken from: https://stackoverflow.com/a/43467144/5589264
export function isValidHttpUrl(string: string) : boolean {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
