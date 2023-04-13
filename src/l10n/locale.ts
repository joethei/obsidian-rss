//taken from https://github.com/valentine195/obsidian-leaflet-plugin/blob/master/src/l10n/locale.ts
import de from "./locales/de";
import en from "./locales/en";
import fr from "./locales/fr";
import ptBr from "./locales/pt-br";
import test from "./locales/test";
import zh from "./locales/zh";

/* istanbul ignore next */
const locale = (window.moment) ? window.moment.locale() : "test";

const localeMap: { [k: string]: Partial<typeof en> } = {
    en,
    de,
    "zh-cn": zh,
    test,
    fr,
    "pt-br": ptBr
};

const userLocale = localeMap[locale];

export default function t(str: keyof typeof en, ...inserts: string[]): string {
    let localeStr = (userLocale && userLocale[str]) ?? en[str];

    for (let i = 0; i < inserts.length; i++) {
        localeStr = localeStr.replace(`%${i + 1}`, inserts[i]);
    }

    return localeStr;
}
