import RssReaderPlugin from "../main";
import t from "../l10n/locale";
import {Setting} from "obsidian";

export function displayHotkeys(plugin: RssReaderPlugin, containerEl: HTMLElement) : void {

    containerEl.empty();

    containerEl.createEl("h2", {text: t("hotkeys")});
    containerEl.createEl("h3", {text: t("hotkeys_reading")});


    new Setting(containerEl)
        .setName(t("create_note"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.create)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                create: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("paste_to_note"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.paste)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                paste: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("open_browser"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.open)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                open: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("copy_to_clipboard"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.copy)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                copy: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("mark_as_favorite_remove"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.favorite)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                favorite: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("mark_as_read_unread"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.read)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...this.plugin.settings.hotkeys,
                                read: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("edit_tags"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.tags)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                tags: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("next"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.next)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                next: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    new Setting(containerEl)
        .setName(t("previous"))
        .addButton(button => {
            button
                .setButtonText(plugin.settings.hotkeys.previous)
                .setTooltip(t("customize_hotkey"))
                .onClick(() => {
                    button.setButtonText(t("press_key"));
                    const listener = async (e: KeyboardEvent) => {
                        window.removeEventListener('keyup', listener);
                        await plugin.writeSettings(() => ({
                            hotkeys: {
                                ...plugin.settings.hotkeys,
                                previous: e.key
                            }
                        }));
                        displayHotkeys(plugin, containerEl);
                    };
                    window.addEventListener('keyup', listener);
                });
        });

    //@ts-ignore
    if (plugin.app.plugins.plugins["obsidian-tts"]) {
        new Setting(containerEl)
            .setName(t("read_article_tts"))
            .setTooltip(t("customize_hotkey"))
            .addButton(button => {
                button
                    .setButtonText(plugin.settings.hotkeys.tts)
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...plugin.settings.hotkeys,
                                    tts: e.key
                                }
                            }));
                            displayHotkeys(plugin, containerEl);
                        };
                        window.addEventListener('keyup', listener);
                    });
            });
    }
}
