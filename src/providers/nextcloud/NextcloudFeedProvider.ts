import {FeedProvider} from "../FeedProvider";
import {Folder} from "../Folder";
import {Feed} from "../Feed";
import RssReaderPlugin from "../../main";
import { requestUrl, RequestUrlResponse, Setting} from "obsidian";
import {Item} from "../Item";
import {NextCloudItem} from "./NextCloudItem";
import {NextCloudFeed} from "./NextCloudFeed";
import {NextCloudFolder} from "./NextCloudFolder";

interface NextcloudAuthData {
    server: string;
    username: string;
    password: string;
    header: string;
}

export class NextcloudFeedProvider implements FeedProvider {
    private readonly server_key = "rss-nc-server";
    private readonly user_key = "rss-nc-user";
    private readonly password_key = "rss-nc-password";
    private readonly path = "/index.php/apps/news/api/v1-2/";

    private _warnings: string[] = [];

    getAuthData(): NextcloudAuthData {
        const username = localStorage.getItem(this.user_key);
        const password = localStorage.getItem(this.password_key);

        const header = username + ":" + password;

        return {
            server: localStorage.getItem(this.server_key),
            username: username,
            password: password,
            header: btoa(header)
        }
    }

    getRequestUrl(endpoint: string): string {
        const authData = this.getAuthData();
        return authData.server + this.path + endpoint;
    }


    async requestData(endpoint: string): Promise<RequestUrlResponse> {
        const authData = this.getAuthData();
        return requestUrl({
            url: this.getRequestUrl(endpoint),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + authData.header,
            }
        });
    }

    async putData(endpoint: string, body?: any) : Promise<RequestUrlResponse> {
        const authData = this.getAuthData();
        return requestUrl({
            url: this.getRequestUrl(endpoint),
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + authData.header,
            },
            body
        });
    }

    id(): string {
        return "nextcloud";
    }


    async isValid(): Promise<boolean> {
        this._warnings = [];
        try {
            const data = await this.requestData("status");
            if (data.status !== 200) {
                this._warnings.push("Server responded with status code: " + data.status);
                return false;
            }

            if (data.json.warnings.improperlyConfiguredCron) {
                this._warnings.push("The NextCloud News App updater is improperly configured and you will lose updates.\n" +
                    "See " + this.getAuthData().server + "/index.php/apps/news for instructions on how to fix it.");
                return false;
            }

            if (data.json.warnings.incorrectDbCharset) {
                this._warnings.push("Your NextCloud database is not properly configured, feed updates with unicode characters might fail");
                return false;
            }
            return true;
        } catch (e) {
            console.log(e);
            this._warnings.push("Could not connect to server");
        }

        return false;
    }

    warnings(): string[] {
        return this._warnings;
    }


    name(): string {
        return "NextCloud News";
    }

    async feeds(): Promise<Feed[]> {
        const data = await this.requestData("feeds");
        const feeds: NextCloudFeed[] = [];
        const items = await this.items();
        for(const feed of data.json.feeds) {
            const feedItems = items.filter(item => item.feedId() === feed.id);
            feeds.push(new NextCloudFeed(this, feed, feedItems));
        }
        return feeds;
    }

    async filteredFolders(): Promise<Folder[]> {
        return [];
    }

    async folders(): Promise<Folder[]> {
        const data = await this.requestData("folders");
        const folders: NextCloudFolder[] = [];
        const feeds = await this.feeds();
        for(const folder of data.json.folders) {
            const folderFeeds = feeds.filter(feed => feed.folderId() === folder.id);
            folders.push(new NextCloudFolder(this, folder, folderFeeds));
        }
        return folders;
    }

    async items(): Promise<Item[]> {
        const data = await this.requestData("items");
        const items: NextCloudItem[] = [];
        for (let item of data.json.items) {
            items.push(new NextCloudItem(this, item));
        }
        return items;
    }

    async displaySettings(plugin: RssReaderPlugin, container: HTMLElement) {

        container.empty();

        const authData = this.getAuthData();

        new Setting(container)
            .setName("Server")
            .addText(text => {
                text
                    .setPlaceholder("https://your-nextcloud.server.zyx")
                    .setValue(authData.server)
                    .onChange(value => {
                        localStorage.setItem(this.server_key, value);
                    });
            });

        new Setting(container)
            .setName("Username")
            .addText(text => {
                text
                    .setPlaceholder("your-username")
                    .setValue(authData.username)
                    .onChange(value => {
                        localStorage.setItem(this.user_key, value);
                    });
            });

        new Setting(container)
            .setName("Password")
            .addText(text => {
                text
                    .setPlaceholder("your password")
                    .setValue(authData.password)
                    .onChange(value => {
                        localStorage.setItem(this.password_key, value);
                    });
                text.inputEl.type = "password";
            });

        const isValid = await this.isValid();

        new Setting(container)
            .setName("Validate")
            .setDesc("Ensure that the service is configured properly")
            .addButton(button => {
                    button
                        .setButtonText("Test")
                        .setIcon(isValid ? "check" : "x")
                        .setClass(isValid ? "rss-test-valid" : "rss-test-invalid")
                        .onClick(async () => {
                            await this.displaySettings(plugin, container);
                        })
                }
            )


        if (!isValid) {
            container.createEl("h4", {text: "Errors"});
            const list = container.createEl("ul");
            for (let warning of this.warnings()) {
                list.createEl("li", {text: warning});
            }
        }
    }

}
