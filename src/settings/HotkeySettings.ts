import t from "../l10n/locale";
import {Setting} from "obsidian";
import {SettingsSection} from "./SettingsSection";

export class HotkeySettings extends SettingsSection {
    getName(): string {
        return t('hotkeys');
    }

    display() {
        this.contentEl.empty();

        this.contentEl.createEl("h2", {text: t("hotkeys")});
        this.contentEl.createEl("h3", {text: t("hotkeys_reading")});


        new Setting(this.contentEl)
            .setName(t("create_note"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.create)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    create: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("paste_to_note"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.paste)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    paste: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("open_browser"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.open)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    open: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("copy_to_clipboard"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.copy)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    copy: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("mark_as_favorite_remove"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.favorite)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    favorite: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("mark_as_read_unread"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.read)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    read: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("edit_tags"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.tags)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    tags: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("next"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.next)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    next: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        new Setting(this.contentEl)
            .setName(t("previous"))
            .addButton(button => {
                button
                    .setButtonText(this.plugin.settings.hotkeys.previous)
                    .setTooltip(t("customize_hotkey"))
                    .onClick(() => {
                        button.setButtonText(t("press_key"));
                        const listener = async (e: KeyboardEvent) => {
                            window.removeEventListener('keyup', listener);
                            await this.plugin.writeSettings(() => ({
                                hotkeys: {
                                    ...this.plugin.settings.hotkeys,
                                    previous: e.key
                                }
                            }));
                            this.display();
                        };
                        window.addEventListener('keyup', listener);
                    });
            });

        //@ts-ignore
        if (this.plugin.app.plugins.plugins["obsidian-tts"]) {
            new Setting(this.contentEl)
                .setName(t("read_article_tts"))
                .setTooltip(t("customize_hotkey"))
                .addButton(button => {
                    button
                        .setButtonText(this.plugin.settings.hotkeys.tts)
                        .onClick(() => {
                            button.setButtonText(t("press_key"));
                            const listener = async (e: KeyboardEvent) => {
                                window.removeEventListener('keyup', listener);
                                await this.plugin.writeSettings(() => ({
                                    hotkeys: {
                                        ...this.plugin.settings.hotkeys,
                                        tts: e.key
                                    }
                                }));
                                this.display();
                            };
                            window.addEventListener('keyup', listener);
                        });
                });
        }
    }
}

