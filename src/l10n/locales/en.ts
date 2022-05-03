export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",

    RSS_Reader: "RSS Reader",
    RSS_Feeds: "RSS Feeds",

    //commands
    open: "Open",
    refresh_feeds: "Refresh feeds",
    create_all: "Create wallabag.xml",

    //folder actions
    mark_all_as_read: "Mark wallabag.xml as read",
    add_tags_to_all: "Add tags to wallabag.xml entries",

    filtered_folders: "Filtered Folders",
    folders: "Folders",
    folder: "Folder",
    feeds: "Feeds",

    //article actions
    create_note: "create new note",
    paste_to_note: "paste to current note",
    copy_to_clipboard: "copy to clipboard",
    open_browser: "open in browser",
    edit_tags: "edit tags",
    mark_as_read: "Mark as read",
    mark_as_unread: "Mark as unread",
    mark_as_favorite: "mark as favorite",
    remove_from_favorites: "remove from favorites",
    read_article_tts: "read article with TTS",
    next: "next",
    previous: "previous",

    mark_as_read_unread: "mark as read/unread",
    mark_as_favorite_remove: "mark as favorite/remove from favorites",

    //action notifications
    marked_as_read: "marked item as read",
    marked_as_unread: "marked item as unread",
    removed_from_favorites: "removed item from favorites",
    added_to_favorites: "marked item as favorite",

    read: "read",
    unread: "unread",
    favorites: "Favorites",
    favorite: "Favorite",
    tags: "Tags",
    tag: "Tag",

    //base modal
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    reset: "restore default",
    fix_errors: "Please fix errors before saving.",

    add_new: "Add new",

    //feed settings
    add_new_feed: "Add new feed",
    feed_already_configured: "you already have a feed configured with that url",
    no_folder: "No folder",

    //feed creation modal
    name: "Name",
    name_help: "What do you want this feed to show up as?",
    url_help: "What is the URL to the feed?",
    folder_help: "What do you categorize this feed as?",

    invalid_name: "you need to specify a name",
    invalid_url: "this url is not valid",
    invalid_feed: "This feed does not have any entries",

    //filter types
    filter_tags: "wallabag.xml articles with tags",
    filter_unread: "All unread articles(from folders)",
    filter_read: "All read articles(from folders)",
    filter_favorites: "Favorites(from folders)",

    //sort order
    sort_date_newest: 'Publication date (new to old)',
    sort_date_oldest: 'Publication date (old to new)',
    sort_alphabet_normal: 'Name (A to Z)',
    sort_alphabet_inverted: 'Name (Z to A)',
    sort: 'Order by',

    //filter creation modal
    filter_name_help: 'What do you want this filter to show up as?',
    filter_type: 'Type',
    filter_type_help: 'Type of filter',
    filter: 'Filter',
    filter_help: 'Folders/Tags to filter on, split by ,',
    only_favorites: 'Show only favorites',
    show_read: "Show read",
    show_unread: "Show unread",
    filter_folder_help: "Only show articles from the following folders",
    filter_feed_help: "Only show articles from the following feeds",
    filter_tags_help: "Only show articles with the following tags",

    from_folders: "from folders: ",
    from_feeds: "from feeds: ",
    with_tags: "with tags: ",

    invalid_tag: "This is not a valid tag",

    note_exists: "there is already a note with that name",
    invalid_filename: "that filename is not valid",

    specify_name: "Please specify a filename",
    cannot_contain: "cannot contain:",
    created_note: "Created note from article",
    inserted_article: "inserted article into note",
    no_file_active: "no file active",


    //settings
    settings: "Settings",
    file_creation: "File creation",
    template_new: "new file template",
    template_new_help: "When creating a note from a article this gets processed.",
    template_paste: "paste article template",
    template_paste_help: "When pasting/copying an article this gets processed.",
    available_variables: "Available variables are:",
    file_location: "Default location for new notes",
    file_location_help: "Where newly created notes are placed",
    file_location_default: "In the default folder",
    file_location_custom: "In the folder specified below",
    file_location_folder: "Folder to create new articles in",
    file_location_folder_help: "newly created articles will appear in this folder",

    date_format: "Date format",
    syntax_reference: "Syntax Reference",
    syntax_looks: "Your current syntax looks like this: ",

    ask_filename: "Ask for filename",
    ask_filename_help: "Disable to apply the template below automatically(with invalid symbols removed)",
    refresh_time: "Refresh time",
    refresh_time_help: "How often should the feeds be refreshed, in minutes, use 0 to disable",
    specify_positive_number: "please specify a positive number",
    multi_device_usage: "Multi device usage",
    multi_device_usage_help: "Keep article status synced when using multiple devices at the same time\n(Requires a restart to become effective)",

    add_new_filter: "Add new filtered folder",
    filter_exists: "you already have a filter configured with that name",
    hotkeys: "Hotkeys",
    hotkeys_reading: "when reading a article",
    press_key: "press a key",
    customize_hotkey: "customize this hotkey",

    refreshed_feeds: "Feeds refreshed",

    //import modal
    import: "Import",
    import_opml: "Import from OPML",
    imported_x_feeds: "Imported %1 feeds",
    choose_file: "Choose file",
    choose_file_help: "Choose file to import",
    export_opml: "Export as OPML",

    default_filename: "Template for filename",
    default_filename_help: "All variables from the paste template are available",

    //cleanup modal
    cleanup: "Cleanup articles",
    cleanup_help: "Removes wallabag.xml entries which fit the criteria specified below.",
    cleanup_help2: "Keep in mind that wallabag.xml articles that still exist in the feed will reappear on the next refresh",
    perform_cleanup: "Perform cleanup",
    all: "all",
    from_feed: "from feed",
    older_than: "older than X Days",
    older_than_help: "keep empty for wallabag.xml, will be ignored if there is no publishing date associated with entry",
    advanced: "Advanced",
    remove_wrong_feed: "Remove wallabag.xml articles that are in the incorrect feed",
    remove_wrong_feed_help: "This might have happened due to a bug in versions pre 0.8",
    scanning_items: "Scanning Articles (%1 / %2)",

    created_export: "Created OPML file in your Vaults root folder",
    add: "Add",
    from_archive: "Get old articles from archive.org",
    reading_archive: "Reading data from archive",
    scanning_duplicates: "Scanning for duplicates",
    do_not_close: "Please do not close this window",

    display_style: "Display Style",
    list: "List",
    cards: "Cards",

    customize_terms: "Customize Terms",
    content: "Content",
    highlight: "Highlight",
    highlight_remove: "remove highlight",

    filter_folder_ignore_help: "ignore the following folders",
    filter_feed_ignore_help: "ignore the following feeds",
    filter_tags_ignore_help: "ignore the following tags",

    loading: "Loading",

    //template settings
    article_title: "Title",
    article_link: "Link to article",
    article_author: "Author of article",
    article_published: "Date published",
    article_description: "Short article description",
    article_content: "article content",
    article_tags: "Tags split by comma",
    article_media: "Link to video/audio file",
    feed_folder: "Folder of feed",
    feed_title: "Title of feed",
    highlights: "Highlights",
    note_created: "Note creation date",
    filename: "Filename",

    display_media: "Include Media",
    base_folder: "Base folder"
}
