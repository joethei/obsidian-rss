## RSS Reader
Plugin for [Obsidian](https://obsidian.md)

![GitHub package.json version](https://img.shields.io/github/package-json/v/joethei/obsidian-rss)
![GitHub manifest.json dynamic (path)](https://img.shields.io/github/manifest-json/minAppVersion/joethei/obsidian-rss?label=lowest%20supported%20app%20version)
![GitHub](https://img.shields.io/github/license/joethei/obsidian-rss)
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)
---
![](https://i.joethei.space/obsidian-rss.png)


## Features
- Reading RSS feeds from within obsidian
- Sorting feeds into folders(sorting into nested folders is on the roadmap [#3](https://github.com/joethei/obsidian-rss/issues/3))
- staring articles
- creating new notes from articles
- pasting article into current note
- creating custom filters
- tagging articles

![Demo GIF](https://i.joethei.space/QQATWu36eC.gif)

## Finding the RSS feed for a website

- Search for the RSS logo or a link on the website
- Use an browser addon ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/awesome-rss/), [Chrome based](https://chrome.google.com/webstore/detail/get-rss-feed-url/kfghpdldaipanmkhfpdcjglncmilendn?hl=de))
- Search the websites sourcecode for `rss`

## Styling
If you want to style the plugin differently you can use the following css classes

- rss-read
- rss-not-read
- rss-filters
- rss-folders
- rss-folder
- rss-feed
- rss-feed-title
- rss-feed-items
- rss-feed-item
- rss-tag
- rss-tooltip
- rss-title
- rss-subtitle
- rss-content

For help with styling you can also check out the `#appearance` channel on the [Obsidian Members Group Discord](https://obsidian.md/community)

### Installing the plugin
- using the build in Community plugins(once this plugin is accepted)
- Using the [Beta Reviewers Auto-update Tester](https://github.com/TfTHacker/obsidian42-brat) plugin with the repo path: `joethei/obsidian-rss`
- Copy over `main.js`, `styles.css`, `manifest.json` from the releases to your vault `VaultFolder/.obsidian/plugins/rss-reader/`.

