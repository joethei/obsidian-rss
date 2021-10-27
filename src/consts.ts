export const VIEW_ID = "RSS_FEED";

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
