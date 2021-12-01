//taken from https://github.com/valentine195/obsidian-leaflet-plugin/blob/master/src/l10n/locale.ts
import en from "./locales/en";
import de from "./locales/de";

const locale = window.moment.locale;

const localeMap: { [k: string]: Partial<typeof en> } = {
    en,
    de
};

const userLocale = localeMap[locale()];

export default function t(str: keyof typeof en, ...inserts: string[]): string {
    let localeStr = (userLocale && userLocale[str]) ?? en[str];

    for (let i = 0; i < inserts.length; i++) {
        localeStr = localeStr.replace(`%${i + 1}`, inserts[i]);
    }

    return localeStr;
}
