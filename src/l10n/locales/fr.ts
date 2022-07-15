export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",

    RSS_Reader: "Lecteur RSS",
    RSS_Feeds: "Fils RSS",

    //commands
    open: "Ouvrir",
    refresh_feeds: "Rafraîchir les fils",
    create_all: "Créer tous les articles",

    //folder actions
    mark_all_as_read: "Marquer tous les articles comme lus",
    add_tags_to_all: "Ajouter des mots-clés à tous les articles",

    filtered_folders: "Dossiers filtrés",
    folders: "Dossiers",
    folder: "Dossier",
    feeds: "Fils",

    //article actions
    create_note: "créer une nouvelle note",
    paste_to_note: "coller dans la note actuelle",
    copy_to_clipboard: "coller dans le presse-papier",
    open_browser: "ouvrir dans le navigateur",
    edit_tags: "éditer les mots-clés",
    mark_as_read: "Marqeur comme lu",
    mark_as_unread: "Marquer comme non lu",
    mark_as_favorite: "marquer comme favori",
    remove_from_favorites: "retirer des favoris",
    read_article_tts: "lire les articles avec TTS",
    next: "prochain",
    previous: "précédent",

    mark_as_read_unread: "marquer comme lu/non lu",
    mark_as_favorite_remove: "marquer comme favori/retirer des favoris",

    //action notifications
    marked_as_read: "article marqué comme lu",
    marked_as_unread: "article marqué comme non lu",
    removed_from_favorites: "article retiré des favoris",
    added_to_favorites: "article marqué comme favori",

    read: "lu",
    unread: "non lu",
    favorites: "Favoris",
    favorite: "Favori",
    tags: "Mots-clés",
    tag: "Mot-clé",

    //base modal
    save: "Sauvegarder",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Éditer",
    reset: "Restaurer les valeurs par défaut",
    fix_errors: "Veuillez corriger les erreurs avant de sauvegarder.",

    add_new: "Ajouter un nouveau",

    //feed settings
    add_new_feed: "Ajouter un nouveau fil",
    feed_already_configured: "Vous avez déjà un fil configuré avec cette URL",
    no_folder: "Aucun dossier",

    //feed creation modal
    name: "Nom",
    name_help: "Comment voulez-vous que ce fil apparaisse?",
    url_help: "Quelle est l'URL du fil?",
    folder_help: "Comment catégorisez-vous ce fil?",

    invalid_name: "Vous devez spécifier un nom",
    invalid_url: "Cet URL n'est pas valide",
    invalid_feed: "Ce fil n'a aucune entrée",

    //filter types
    filter_tags: "Tous les articles avec des mots-clés",
    filter_unread: "Tous les articles non lus (à partir des dossiers)",
    filter_read: "Tous les articles lus (à partir des dossiers)",
    filter_favorites: "Favoris (à partir des dossiers)",

    //sort order
    sort_date_newest: 'Par date (du plus récent au plus ancien)',
    sort_date_oldest: 'Par date (du plus ancien au plus récent)',
    sort_alphabet_normal: 'Par ordre alphabétique (de A à Z)',
    sort_alphabet_inverted: 'Par ordre alphabétique (de Z à A)',
    sort: 'Trier par',

    //filter creation modal
    filter_name_help: 'Comment voulez-vous que ce filtre apparaisse?',
    filter_type: 'Type',
    filter_type_help: 'Type de filtre',
    filter: 'Filtre',
    filter_help: 'Dossiers/Mots-clés à filtrer, séparés par ,',
    only_favorites: 'Montrer seulement les favoris',
    show_read: "Montrer les articles lus",
    show_unread: "Montrer les articles non lus",
    filter_folder_help: "Montrer seulement les articles dans ces dossiers",
    filter_feed_help: "Montrer seulement les articles dans ces fils",
    filter_tags_help: "Montrer seulement les articles avec ces mots-clés",

    from_folders: "des dossiers: ",
    from_feeds: "des fils: ",
    with_tags: "avec les mots-clés: ",

    no_feed_with_name: "Il n'y a pas de fil avec ce nom",
    invalid_tag: "Ce mot-clé n'est pas valide",

    note_exists: "Cette note existe déjà",
    invalid_filename: "Ce nom de fichier n'est pas valide",

    specify_name: "Veuillez spécifier un nom",
    cannot_contain: "ne peut pas contenir:",
    created_note: "Note créée à partir de l'article",
    inserted_article: "Article inséré dans la note",
    no_file_active: "Aucun fichier actif",


    //settings
    settings: "Réglages",
    file_creation: "Création de fichier",
    template_new: "Nouveau modèle de fichier",
    template_new_help: "Ceci est effectué en créant une note à partir d'un article",
    template_paste: "Coller le modèle d'article",
    template_paste_help: "Ceci est effectué en collant un modèle d'article dans une note",
    available_variables: "Les varibles disponibles sont:",
    file_location: "Emplacements par défaut pour les nouvelles notes",
    file_location_help: "Là où sont placées les nouvelles notes",
    file_location_default: "Dans le dossier par défaut",
    file_location_custom: "Dans le dossier spécifié plus bas",
    file_location_folder: "Dossiers dans lesquels créer de novuveaux articles",
    file_location_folder_help: "Les nouvelles notes seront créées dans ce dossier",

    date_format: "Format de date",
    syntax_reference: "Référence de syntaxe",
    syntax_looks: "Votre syntaxe actuelle ressemble à ceci:",

    ask_filename: "Demander le nom de fichier",
    ask_filename_help: "Désactiver pour appliquer le modèle automatiquement (avec les symboles invalides retirés)",
    refresh_time: "Temps de rafraîchissement",
    refresh_time_help: "À quelle fréquence le fil sera rechargé en minutes, utiliser 0 pour désactiver",
    specify_positive_number: "Veuillez spécifier un nombre positif",
    multi_device_usage: "Utilsation sur plusieurs appareils",
    multi_device_usage_help: "Garder le statut des articles synchronisé entre plusieurs appareils\n(Nécessite un redémerrage pour prendre effet)",

    add_new_filter: "Ajouter un nouveau dossier filtré",
    filter_exists: "Un filtre avec ce nom existe déjà",
    hotkeys: "Raccourcis",
    hotkeys_reading: "en lisant un article",
    press_key: "Appuyez sur une touche",
    customize_hotkey: "Personnaliser ce raccourci",

    refreshed_feeds: "Fils rafraîchis",

    //import modal
    import: "Importer",
    import_opml: "Importer un fichier OPML",
    imported_x_feeds: "%1 fils importés",
    choose_file: "Choisir un fichier",
    choose_file_help: "Choisir un fichier à importer",
    export_opml: "Exporter un fichier OPML",

    default_filename: "Modèle pour le nom de fichier",
    default_filename_help: "Toutes les variables du modèle collé sont disponibles",

    //cleanup modal
    cleanup: "Nettoyer les articles",
    cleanup_help: "Retire les entrées qui correspondent au critère suivant:",
    cleanup_help2: "Prenez-note que les articles qui existent toujours dans le fil réparraîtront au prochain rafraîchissement",
    perform_cleanup: "Nettoyer",
    all: "tout",
    from_feed: "à partir du fil",
    older_than: "plus vieux que X Jours",
    older_than_help: "garde vide pour tous, sera ignoré s'il n'existe pas de date de publication associée à l'article",
    advanced: "Avancé",
    remove_wrong_feed: "Retirer tous les articles qui sont dans un fil incorrect",
    remove_wrong_feed_help: "Ceci peut être arrivé en raison d'un bug dans les version pré 0.8",
    scanning_items: "Articles en cours de scannage (%1 / %2)",

    created_export: "Fichier OPML créé dans le dossier source",
    add: "Ajouter",
    from_archive: "Obtenir des anciens articles à partir de archive.org",
    reading_archive: "Lecture de l'archive en cours",
    scanning_duplicates: "Scan des doublons en cours",
    do_not_close: "Ne pas fermer cette fenêtre",

    display_style: "Style d'affichage",
    list: "Liste",
    cards: "Cartes",

    customize_terms: "Personnaliser les termes",
    content: "Contenu",
    highlight: "Surligner",
    highlight_remove: "Retirer le surlignement",

    filter_folder_ignore_help: "Ignorer les dossiers suivants",
    filter_feed_ignore_help: "Ignorer les fils suivants",
    filter_tags_ignore_help: "Ignorer les mots-clés suivants",

    loading: "En cours de hargement",

    //template settings
    article_title: "Titre",
    article_link: "Lien vers l'article",
    article_author: "Auteur de l'article",
    article_published: "Date de publication",
    article_description: "Courte descrition de l'article",
    article_content: "Contenu de l'article",
    article_tags: "Mots-clés séparés par des virgules",
    article_media: "Lien vers la vidéo/ le fichier audio",
    feed_folder: "Dossier du fil",
    feed_title: "Titre du fil",
    highlights: "Surlignements",
    note_created: "Date de création de la note",
    filename: "Nom du fichier",

    display_media: "Inclure les médias",
    base_folder: "Dossier source",
}
