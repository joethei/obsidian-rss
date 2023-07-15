export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",

    RSS_Reader: "RSS Reader",
    RSS_Feeds: "RSS Feeds",

    //commands
    open: "Åben",
    refresh_feeds: "Opdater feeds",
    create_all: "Opret alle",

    //folder actions
    mark_all_as_read: "Marker samtlige som læst",
    add_tags_to_all: "Tilføj tags til samtlige",

    filtered_folders: "Filtrerede mapper",
    folders: "Mapper",
    folder: "Mappe",
    feeds: "Feeds",

    //article actions
    create_note: "opret ny note",
    paste_to_note: "indsæt til nuværende note",
    copy_to_clipboard: "kopier til udklipsholder",
    open_browser: "åbn i browser",
    edit_tags: "rediger tags",
    mark_as_read: "marker som læst",
    mark_as_unread: "marker som ulæst",
    mark_as_favorite: "marker som favorit",
    remove_from_favorites: "fjern fra favoritter",
    read_article_tts: "læs artikel med TTS (tekst-til-tale)",
    next: "næste",
    previous: "forrige",

    mark_as_read_unread: "marker som læst/ulæst",
    mark_as_favorite_remove: "marker som/fjern fra favoritter",

    //action notifications
    marked_as_read: "markeret som læst",
    marked_as_unread: "markeret som ulæst",
    removed_from_favorites: "fjernet fra favoritter",
    added_to_favorites: "markeret som favorit",

    read: "læst",
    unread: "ulæst",
    favorites: "Favoritter",
    favorite: "Favorit",
    tags: "Tags",
    tag: "Tag",

    //base modal
    save: "Gem",
    cancel: "Annuller",
    delete: "Slet",
    edit: "Rediger",
    reset: "gendan standard",
    fix_errors: "Ret fejl før du gemmer.",

    add_new: "Tilføj ny",

    //feed settings
    add_new_feed: "Tilføj nyt feed",
    feed_already_configured: "du har allerede et RSS feed konfigureret med det samme url",
    no_folder: "Ingen mappe",

    //feed creation modal
    name: "Navn",
    name_help: "Hvad vil du gerne have at dette RSS feed skal vises som?",
    url_help: "Hvilket URL passer til dette RSS feed?",
    folder_help: "Hvilken kategori vil du angive dette RSS feed som?",

    invalid_name: "Venligst angiv et navn",
    invalid_url: "URL er ikke gyldigt",
    invalid_feed: "RSS feed har ingen elementer",

    //filter types
    filter_tags: "Alle artikler med tags",
    filter_unread: "Alle ulæste artikler (fra mapper)",
    filter_read: "Alle læste artikler (fra mapper)",
    filter_favorites: "Favoritter (fra mapper)",

    //sort order
    sort_date_newest: 'Udgivelsesdato (ny til gammel)',
    sort_date_oldest: 'Udgivelsesdato (gammel til ny)',
    sort_alphabet_normal: 'Navn (A til Å)',
    sort_alphabet_inverted: 'Navn (Å til A)',
    sort: 'Sorter efter',

    //filter creation modal
    filter_name_help: 'Hvad vil du have, at dette filter skal vises som?',
    filter_type: 'Type',
    filter_type_help: 'Filtreringstype',
    filter: 'Filter',
    filter_help: 'Filtrere ved hjælp af mapper/tags, opdelt efter ,',
    only_favorites: 'Vis kun favoritter',
    show_read: "Vis læste",
    show_unread: "Vis ulæste",
    filter_folder_help: "Vis kun artikler fra følgende mapper",
    filter_feed_help: "Vis kun artikler fra følgende feeds",
    filter_tags_help: "Vis kun artikler med følgende tags",

    from_folders: "fra mapper: ",
    from_feeds: "fra RSS feeds: ",
    with_tags: "inklusive tags: ",

    no_feed_with_name: "Der er intet RSS feed med dette navn",
    invalid_tag: "Dette er ikke et gyldigt tag",

    note_exists: "der findes allerede en note med dette navn",
    invalid_filename: "filnavnet er ikke gyldigt",

    specify_name: "Angiv et filnavn",
    cannot_contain: "kan ikke indeholde:",
    created_note: "Oprettet note fra artikel",
    inserted_article: "insat artikel i note",
    no_file_active: "ingen fil er aktiv",


    //settings
    settings: "Indstillinger",
    file_creation: "Fil oprettelse",
    template_new: "skabelon til ny fil",
    template_new_help: "Når du opretter en note fra en artikel, bliver dette behandlet.",
    template_paste: "indsæt artikelskabelon",
    template_paste_help: "Når man indsætter/kopierer en artikel, bliver dette behandlet.",
    available_variables: "Tilgængelige variabler:",
    file_location: "Default location for new notes",
    file_location_help: "Standardplacering for nye noter",
    file_location_default: "I standard mappe",
    file_location_custom: "I nedenstående mappe",
    file_location_folder: "Mappe til at oprette nye artikler i",
    file_location_folder_help: "nye artikler vil vises i denne mappe",

    date_format: "Dato format",
    syntax_reference: "Syntaksreference",
    syntax_looks: "Den valgte syntaks ser således ud: ",

    ask_filename: "Spørg efter filnavn",
    ask_filename_help: "Deaktiver for at anvende nedenstående skabelon (ugyldige symboler bliver fjernet)",
    refresh_time: "Opdateringstid",
    refresh_time_help: "Hvor ofte skal RSS feeds opdateres på, angivet i minutter. Anvend 0 for at deaktivere automatisk opdatering",
    specify_positive_number: "angiv venligst et positivt tal",
    multi_device_usage: "Anvendelse af flere enheder",
    multi_device_usage_help: "Hold status for artikler synkroniseret, når du anvender flere enheder på samme tid\n(Kræver genstart)",

    add_new_filter: "Tilføj ny filtreret mappe",
    filter_exists: "der er allerede et filter konfigureret med det navn",
    hotkeys: "Genvejstaster",
    hotkeys_reading: "når du læser en artikel",
    press_key: "tryk på en tast",
    customize_hotkey: "tilpas genvejstasten",

    refreshed_feeds: "RSS feeds er opdateret",

    //import modal
    import: "Import",
    import_opml: "Importere fra OPML",
    imported_x_feeds: "Importerede %1 feeds",
    choose_file: "Vælg fil",
    choose_file_help: "Vælg en fil der skal importeres",
    export_opml: "Eksportere som OPML",

    default_filename: "Skabelon til filnavn",
    default_filename_help: "Alle variabler fra skabelonen er tilgængelige",

    //cleanup modal
    cleanup: "Ryd op i artikler",
    cleanup_help: "Fjerner elementer, der passer til kriterierne specificeret nedenfor.",
    cleanup_help2: "Bemærk at artikler der stadig eksisterer i RSS feedet, vil vise sig når feedet bliver opdateret igen",
    perform_cleanup: "Udfør oprydning",
    all: "alle",
    from_feed: "fra feed",
    older_than: "ældre end X dage",
    older_than_help: "hold tom for alle vil blive ignoreret hvis der ikke er nogen udgivelsesdato forbundet med indtastningen",
    advanced: "Avanceret",
    remove_wrong_feed: "Fjern alle artikler, der er i det forkerte feed",
    remove_wrong_feed_help: "Dette kan være sket på grund af en fejl i versionerne før 0.8",
    scanning_items: "Gennemgår artikler (%1 / %2)",

    created_export: "Oprettet OPML-fil i din Vault",
    add: "Tilføj",
    from_archive: "Hent gamle artikler fra archive.org",
    reading_archive: "Læser data fra arkiv",
    scanning_duplicates: "Scanner for dubletter",
    do_not_close: "Luk ikke dette vindue",

    display_style: "Visning",
    list: "Liste",
    cards: "Kort",

    customize_terms: "Tilpas begreber",
    content: "Indhold",
    highlight: "Marker",
    highlight_remove: "fjern markering",

    filter_folder_ignore_help: "ignorer følgende mapper",
    filter_feed_ignore_help: "ignorer følgende feeds",
    filter_tags_ignore_help: "ignorer følgende tags",

    loading: "Indlæser",

    //template settings
    article_title: "Titel",
    article_link: "Link til artikel",
    article_author: "Artiklens forfatter",
    article_published: "Udgivelsesdato",
    article_description: "Kort artikelbeskrivelse",
    article_content: "Indhold i artiklen",
    article_tags: "Tags opdelt med komma",
    article_media: "Link til video/lydfil",
    feed_folder: "Feed mappe",
    feed_title: "Feed titel",
    highlights: "Markeringer",
    note_created: "Oprettet",
    filename: "Filnavn",

    misc: "Diverse",

    display_media: "Inkluder medier",
    base_folder: "Standard mappe",

    provider: "Udbyder"
}
