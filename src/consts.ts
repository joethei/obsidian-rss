export const VIEW_ID = "RSS_FEED";
export const FILE_NAME_REGEX = /["\/<>:|?]/gm;
export const TAG_REGEX = /([\p{Letter}\p{Emoji_Presentation}\p{Number}\/_-]+)/u;
export const NUMBER_REGEX = /^[0-9]*$/gm;

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
