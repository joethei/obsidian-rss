export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",
    
    RSS_Reader: "Lettore Rss",
    RSS_Feeds: "Feed RSS",

    //commands
    open: "Apri",
    refresh_feeds: "Aggiorna i feed",
    create_all: "Crea tutti gli articoli",

    //folder actions
    mark_all_as_read: "Segna tutti come letti",
    add_tags_to_all: "Aggiungi tag a tutti gli articoli",

    filtered_folders: "Cartelle filtrate",
    folders: "Cartelle",
    folder: "Cartella",
    feeds: "Feed",

    //article actions
    create_note: "crea una nuova nota",
    paste_to_note: "incolla nella nota corrente",
    copy_to_clipboard: "copia negli appunti",
    open_browser: "apri nel browser",
    edit_tags: "modifica i tag",
    mark_as_read: "Segna come letto",
    mark_as_unread: "Segna come non letto",
    mark_as_favorite: "contrassegna come preferito",
    remove_from_favorites: "rimuovi dai preferiti",
    read_article_tts: "leggi l'articolo con il TTS",
    next: "successivo",
    previous: "precedente",

    mark_as_read_unread: "segna come letto/non letto",
    mark_as_favorite_remove: "contrassegna come preferito/rimuovi dai preferiti",

    //action notifications
    marked_as_read: "articolo contrassegnato come letto",
    marked_as_unread: "articolo contrassegnato come non letto",
    removed_from_favorites: "articolo rimosso dai preferiti",
    added_to_favorites: "articolo contrassegnato come preferito",

    read: "letto",
    unread: "non letto",
    favorites: "Preferiti",
    favorite: "Preferito",
    tags: "Tag",
    tag: "Tag",

    //base modal
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    reset: "ripristina i valori predefiniti",
    fix_errors: "Correggi gli errori prima di salvare.",

    add_new: "Aggiungere nuova",

    //feed settings
    add_new_feed: "Aggiungi un nuovo feed",
    feed_already_configured: "hai già un feed configurato con questo URL",
    no_folder: "Nessuna cartella",

    //feed creation modal
    name: "Nome",
    name_help: "Come vuoi che venga visualizzato questo feed?",
    url_help: "Qual è l'URL del feed?",
    folder_help: "Come classifichi questo feed?",

    invalid_name: "è necessario specificare un nome",
    invalid_url: "questo URL non è valido",
    invalid_feed: "Questo feed non ha voci",

    //filter types
    filter_tags: "Tutti gli articoli con tag",
    filter_unread: "Tutti gli articoli non letti (dalle cartelle)",
    filter_read: "Tutti gli articoli letti (dalle cartelle)",
    filter_favorites: "Preferiti (dalle cartelle)",

    //sort order
    sort_date_newest: 'Data (dal più recente al più vecchio)',
    sort_date_oldest: 'Data (dal più vecchio al più recente)',
    sort_alphabet_normal: 'Ordine alfabetico (dalla A alla Z)',
    sort_alphabet_inverted: 'Ordine alfabetico (dalla Z alla A)',
    sort: 'Ordina per',

    //filter creation modal
    filter_name_help: 'Come vuoi che venga visualizzato questo filtro?',
    filter_type: 'Tipo',
    filter_type_help: 'Tipo di filtro',
    filter: 'Filtro',
    filter_help: 'Cartelle/tag su cui filtrare, divisi per ,',
    only_favorites: 'Mostra solo i preferiti',
    show_read: "Mostra gli articoli letti",
    show_unread: "Mostra gli articoli non letti",
    filter_folder_help: "Mostra solo gli articoli delle seguenti cartelle",
    filter_feed_help: "Mostra solo gli articoli dei seguenti feed",
    filter_tags_help: "Mostra solo articoli con i seguenti tag",

    from_folders: "dalle cartelle: ",
    from_feeds: "dai feed: ",
    with_tags: "dai tag: ",

    no_feed_with_name: "Non c'è nessun feed con questo nome",
    invalid_tag: "Questo non è un tag valido",

    note_exists: "c'è già una nota con questo nome",
    invalid_filename: "questo nome file non è valido",

    specify_name: "Si prega di specificare un nome",
    cannot_contain: "non può contenere:",
    created_note: "Nota creata dall'articolo",
    inserted_article: "articolo inserito nella nota",
    no_file_active: "nessun file attivo",


    //settings
    settings: "Impostazioni",
    file_creation: "Creazione file",
    template_new: "nuovo modello di file",
    template_new_help: "Quando si crea una nota da un articolo, questa viene elaborata.",
    template_paste: "incolla il modello dell'articolo",
    template_paste_help: "Quando si incolla/copia un articolo, questo viene elaborato.",
    available_variables: "Le variabili disponibili sono:",
    file_location: "Posizione predefinita per le nuove note",
    file_location_help: "Dove vengono inserite le note appena create",
    file_location_default: "Nella cartella predefinita",
    file_location_custom: "Nella cartella specificata qui sotto",
    file_location_folder: "Cartella in cui creare nuovi articoli",
    file_location_folder_help: "gli articoli appena creati appariranno in questa cartella",

    date_format: "Formato data",
    syntax_reference: "Riferimento sintattico",
    syntax_looks: "La tua sintassi attuale è simile a questa: ",

    ask_filename: "Chiedi il nome del file",
    ask_filename_help: "Disabilita l'applicazione automatica del modello sottostante (con i simboli non validi rimossi)",
    refresh_time: "Tempo di aggiornamento",
    refresh_time_help: "Ogni quanto devono essere aggiornati i feed, in minuti, usa 0 per disabilitare",
    specify_positive_number: "si prega di specificare un numero positivo",
    multi_device_usage: "Utilizzo di più dispositivi",
    multi_device_usage_help: "Mantieni sincronizzato lo stato dell'articolo quando utilizzi più dispositivi contemporaneamente\n(Richiede un riavvio per applicare la modifica)",

    add_new_filter: "Aggiungi nuova cartella filtrata",
    filter_exists: "hai già un filtro configurato con quel nome",
    hotkeys: "Tasti di scelta rapida",
    hotkeys_reading: "durante la lettura di un articolo",
    press_key: "premi un tasto",
    customize_hotkey: "personalizza questo tasto di scelta rapida",

    refreshed_feeds: "Feed aggiornati",

    //import modal
    import: "Importare",
    import_opml: "Importa da OPML",
    imported_x_feeds: "%1 feed importati",
    choose_file: "Scegli il file",
    choose_file_help: "Scegli il file da importare",
    export_opml: "Esporta come OPML",

    default_filename: "Modello per il nome del file",
    default_filename_help: "Sono disponibili tutte le variabili del modello incollato",

    //cleanup modal
    cleanup: "Oggetti puliti",
    cleanup_help: "Rimuove le voci che soddisfano i seguenti criteri.",
    cleanup_help2: "Tieni presente che gli articoli che sono ancora nel feed riappariranno al prossimo aggiornamento",
    perform_cleanup: "Esegui la pulizia",
    all: "tutto",
    from_feed: "dal feed",
    older_than: "più vecchio di X giorni",
    older_than_help: "mantenere vuoto per tutti, verrà ignorato se non c'è una data di pubblicazione associata all'articolo",
    advanced: "Avanzate",
    remove_wrong_feed: "Rimuovi tutti gli articoli che si trovano nel feed errato",
    remove_wrong_feed_help: "Ciò potrebbe essere accaduto a causa di un bug nelle versioni precedenti alla 0.8",
    scanning_items: "Scansione articoli (%1 / %2)",

    created_export: "File OPML creato nella cartella principale",
    add: "Aggiungere",
    from_archive: "Ottieni vecchi articoli da archive.org",
    reading_archive: "Lettura dei dati dall'archivio",
    scanning_duplicates: "Scansione dei duplicati",
    do_not_close: "Si prega di non chiudere questa finestra",

    display_style: "Stile di visualizzazione",
    list: "Lista",
    cards: "Carte",

    customize_terms: "Personalizza i termini",
    content: "Contenuto",
    highlight: "Evidenziare",
    highlight_remove: "rimuovere l'evidenziazione",

    filter_folder_ignore_help: "ignorare le seguenti cartelle",
    filter_feed_ignore_help: "ignorare le seguenti feed",
    filter_tags_ignore_help: "ignorare le seguenti tag",

    loading: "Caricamento",

    //template settings
    article_title: "Titolo",
    article_link: "Link all'articolo",
    article_author: "Autore dell'articolo",
    article_published: "Data di pubblicazione",
    article_description: "Breve descrizione dell'articolo",
    article_content: "contenuto dell'articolo",
    article_tags: "Tag divisi per virgola",
    article_media: "Collegamento al file video/audio",
    feed_folder: "Cartella dei feed",
    feed_title: "Titolo del feed",
    highlights: "Punti salienti",
    note_created: "Data di creazione della nota",
    filename: "Nome del file",

    misc: "Varie",

    display_media: "Includi contenuti multimediali",
    base_folder: "Cartella di origine",

    provider: "Provider"
}
