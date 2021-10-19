import {addIcon, Plugin, WorkspaceLeaf} from 'obsidian';
import {RssReaderSettings, RSSReaderSettingsTab} from "./settings";
import ListFeedsViewLoader from "./ListFeedsViewLoader";
import {settingsWrit} from "./stores";

export default class RssReaderPlugin extends Plugin {
	settings: RssReaderSettings;
	private view: ListFeedsViewLoader;

	async onload() {
		console.log('loading plugin rss reader');

		addIcon('rss-feed', '<g\n' +
			'     id="g55"\n' +
			'     transform="matrix(0.24810833,0,0,0.24810832,-13.049781,-12.438073)"><path fill="currentColor" stroke="currentColor"\n' +
			'       d="m 119.9,336.1 c -30.8,0 -55.9,25.1 -55.9,55.8 0,30.8 25.1,55.6 55.9,55.6 30.9,0 55.9,-24.9 55.9,-55.6 0,-30.7 -25,-55.8 -55.9,-55.8 z m 0,95.4 c -22,0 -39.9,-17.8 -39.9,-39.6 0,-21.9 17.9,-39.8 39.9,-39.8 22,0 39.9,17.9 39.9,39.8 0,21.8 -17.9,39.6 -39.9,39.6 z"\n' +
			'       id="path49" /><path fill="currentColor" stroke="currentColor"\n' +
			'       d="m 64,192 v 79.9 c 48,0 94.1,14.2 128,48.1 33.9,33.9 48,79.9 48,128 h 80 C 320,308.1 204,192 64,192 Z m 239.5,240 h -48 C 252.4,382.3 234.5,339.9 203.3,308.7 172.1,277.4 130,259.5 80,256.4 v -47.8 c 26,1.8 52.1,8 76.7,18.5 28.5,12.2 54.2,29.6 76.4,51.8 22.2,22.2 39.6,47.9 51.8,76.4 10.6,24.6 16.8,50.3 18.6,76.7 z"\n' +
			'       id="path51" /><path fill="currentColor" stroke="currentColor"\n' +
			'       d="m 64,64 v 79.9 c 171,0 303.9,133 303.9,304.1 H 448 C 448,236.3 276,64 64,64 Z M 291.4,220.5 C 235.4,164.4 161,132 80,128.2 V 80.3 C 270,88.5 423.5,241.8 431.7,432 H 383.5 C 379.7,351.1 347.3,276.5 291.4,220.5 Z"\n' +
			'       id="path53" /></g>');

		this.register(
			settingsWrit.subscribe((value) => {
				console.log("updated settings");
				this.settings = value;
			})
		);
		await this.loadSettings();

		this.addCommand({
			id: "rss-reveal",
			name: "Open Feed",
			checkCallback: (checking: boolean) => {
				if(checking) {
					return (this.app.workspace.getLeavesOfType("RSS_FEED").length === 0);
				}
				this.initLeaf();
			}
			});

		this.registerView("RSS_FEED", (leaf: WorkspaceLeaf) => (this.view = new ListFeedsViewLoader(leaf, this)));

		this.addSettingTab(new RSSReaderSettingsTab(this.app, this));

		/*if(this.app.workspace.layoutReady) {
			this.initLeaf();
		} else {
			this.registerEvent(this.app.workspace.on("layout-change", this.initLeaf.bind(this)));
		}*/

	}

	onunload() {
		console.log('unloading plugin rss reader');
		this.app.workspace
			.getLeavesOfType("RSS_FEED")
			.forEach((leaf) => leaf.detach());
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType("RSS_FEED").length) {
			return;
		}
		this.app.workspace.getRightLeaf(false).setViewState({
			type: "RSS_FEED",
		});
	}

	async loadSettings(): Promise<void> {
		const options = await this.loadData();
		settingsWrit.update((old) => {
			return {
				...old,
				...(options || {}),
			};
		});
		console.log(this.settings);
		await this.saveData(this.settings);
	}

	async writeSettings(
		changeOpts: (settings: RssReaderSettings) => Partial<RssReaderSettings>
	): Promise<void> {
		settingsWrit.update((old) => ({ ...old, ...changeOpts(old) }));
		await this.saveData(this.settings);
	}
}
