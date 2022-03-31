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
- Sorting feeds into folders
- staring articles
- creating new notes from articles
- pasting article into current note
- creating custom filters
- tagging articles
- support for audio and video feeds
- reading articles with Text to speech (if the [TTS plugin](https://github.com/joethei/obsidian-tts) is installed)
- multi language support(see [#43](https://github.com/joethei/obsidian-rss/issues/43) for translation instructions)
- and more on the [Roadmap](https://github.com/joethei/obsidian-rss/projects/1)

![Demo GIF](https://i.joethei.space/QQATWu36eC.gif)

## Getting Started

After installing the plugin:

- Go to the plugin configuration and add a feed (under the *Content* section).
- In Obsidian, expand the right hand pane and click the RSS tab.

## Finding the RSS feed for a website

- Search for the RSS logo or a link on the website
- Use an browser addon ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/awesome-rss/), [Chrome based](https://chrome.google.com/webstore/detail/get-rss-feed-url/kfghpdldaipanmkhfpdcjglncmilendn?hl=de))
- Search the websites sourcecode for `rss`

## Tips
- get fulltext content for some truncated RSS feeds with [morss.it](https://morss.it/)
- get feeds from some social media sites with [RSS Box](https://rssbox.herokuapp.com/)
- Filter content from feeds with [SiftRSS](https://siftrss.com/)
- Get an RSS feed for a site that does not support RSS with [RSS-proxy](https://github.com/damoeb/rss-proxy/) or [RSS Hub](https://github.com/DIYgod/RSSHub)

## Template variables
- `{{title}}` title of article
- `{{link}}` link to article
- `{{author}}` author of article
- `{{published}}` publishing date, you can also specify a custom date format like this: `{{published:YYYYMMDD}}`
- `{{created}}` date of note creation, you can also specify a custom date format like this: `{{created:YYYYMMDD}}`
- `{{content}}` the actual content
- `{{description}}` short description
- `{{folder}}` the folder the feed is in
- `{{feed}}` the name of the feed
- `{{filename}}` the filename, only available in the new file template
- `{{tags}}` - tags, seperated by comma, you can also specify a seperator like this: `{{tags:;}}`
- `{{#tags}}` - tags with #, seperated by comma, with #, you can also specify a seperator like this: `{{#tags:;}}`
- `{{media}}` link to media
- `{{highlights}}` - list of highlights, you can also specify a custom style, this example creates a [admonition](https://github.com/valentine195/obsidian-admonition) for each highlight:
    ![](https://i.joethei.space/obsidian-rss-highlight-syntax.png)

## ⚠ Security
- This plugin contacts the servers that host the RSS feeds you have specified.
- RSS feeds can contain arbitrary data, this data will get sanitized before being displayed.
- Many Obsidian plugins use codeblocks to add some functionality. This plugin sanitizes these codeblocks at read/note creation time. This is to block rss feeds from executing arbitrary plugin code.
- Some plugins allow for different kinds of inline syntax's, these are treated individually (Currently only _Dataview_ and _Templater_).


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
- rss-modal
- rss-title
- rss-subtitle
- rss-content

For help with styling you can also check out the `#appearance` channel on the [Obsidian Members Group Discord](https://obsidian.md/community)

### Installing the plugin
- `Settings > Third-party plugins > Community Plugins > Browse` and search for `RSS Reader`
- Using the [Beta Reviewers Auto-update Tester](https://github.com/TfTHacker/obsidian42-brat) plugin with the repo path: `joethei/obsidian-rss`
- Copy over `main.js`, `styles.css`, `manifest.json` from the releases to your vault `VaultFolder/.obsidian/plugins/rss-reader/`.

