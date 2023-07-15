export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",

    RSS_Reader: "RSS Reader",
    RSS_Feeds: "RSS Feeds",

    //commands
    open: "Abrir",
    refresh_feeds: "Actualizar feeds",
    create_all: "Crear todos",

    //folder actions
    mark_all_as_read: "Marcar todos como leídos",
    add_tags_to_all: "Agregar etiquetas a todas las entradas",

    filtered_folders: "Carpetas Filtradas",
    folders: "Carpetas",
    folder: "Carpeta",
    feeds: "Feeds",

    //article actions
    create_note: "crear nueva nota",
    paste_to_note: "pegar en la nota actual",
    copy_to_clipboard: "copiar al portapapeles",
    open_browser: "abrir en el navegador",
    edit_tags: "modificar etiquetas",
    mark_as_read: "Marcar como leído",
    mark_as_unread: "Marcar como no leído",
    mark_as_favorite: "marcar como favorito",
    remove_from_favorites: "quitar de favoritos",
    read_article_tts: "leer artículo con TTS",
    next: "siguiente",
    previous: "anterior",

    mark_as_read_unread: "marcar como leído/no leído",
    mark_as_favorite_remove: "marcar como favorito/quitar de favoritos",

    //action notifications
    marked_as_read: "marcar ítem como leído",
    marked_as_unread: "arcar ítem como no leído",
    removed_from_favorites: "quitar ítem de favoritos",
    added_to_favorites: "marcar ítem como favorito",

    read: "leído",
    unread: "no leído",
    favorites: "Favoritos",
    favorite: "Favorito",
    tags: "Etiquetas",
    tag: "Etiqueta",

    //base modal
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Modificar",
    reset: "restaurar valores por defecto",
    fix_errors: "Por favor corrije los errores antes de guardar.",

    add_new: "Agregar nuevo",

    //feed settings
    add_new_feed: "Agregar nuevo feed",
    feed_already_configured: "Ya posees un feed configurado con esa url",
    no_folder: "Sin carpeta",

    //feed creation modal
    name: "Nombre",
    name_help: "Cómo quieres que se muestre este feed?",
    url_help: "Cuál es la URL de este feed?",
    folder_help: "Cómo categorizas este feed?",

    invalid_name: "necesitas especificar un nombre",
    invalid_url: "esta url no es válida",
    invalid_feed: "Este feed no tiene ninguna entrada",

    //filter types
    filter_tags: "Todos los artículos con etiquetas",
    filter_unread: "Todos los artículos no leídos (de carpetas)",
    filter_read: "Todos los artículos leídos (de carpetas)",
    filter_favorites: "Favoritos (de carpetas)",

    //sort order
    sort_date_newest: 'Fecha de publicación (nuevo a viejo)',
    sort_date_oldest: 'Fecha de publicación (viejo a nuevo)',
    sort_alphabet_normal: 'Nombre (A a Z)',
    sort_alphabet_inverted: 'Nombre (Z a A)',
    sort: 'Ordenar por',

    //filter creation modal
    filter_name_help: 'Cómo quieres que se muestre este filtro?',
    filter_type: 'Tipo',
    filter_type_help: 'Tipo de filtro',
    filter: 'Filtro',
    filter_help: 'Carpetas/Etiquetas para filtrar, separadas por ,',
    only_favorites: 'Mostrar solo favoritos',
    show_read: "Mostrar leídos",
    show_unread: "Mostrar no leídos",
    filter_folder_help: "Solo mostrar artículos de las siguientes carpetas",
    filter_feed_help: "Solo mostrar artículos de los siguientes feeds",
    filter_tags_help: "Solo mostrar artículos con las siguientes etiquetas",

    from_folders: "de carpetas: ",
    from_feeds: "de feeds: ",
    with_tags: "con etiquetas: ",

    no_feed_with_name: "No existe un feed con este nombre",
    invalid_tag: "Esta no es una etiqueta válida",

    note_exists: "Ya existe una nota con ese nombre",
    invalid_filename: "Ese nombre de archivo no es válido",

    specify_name: "Por favor especifica un nombre de archivo",
    cannot_contain: "no puede contener:",
    created_note: "Nota creada a partir de un artículo",
    inserted_article: "Artículo insertado en una nota",
    no_file_active: "No hay un archivo activo",


    //settings
    settings: "Configuraciones",
    file_creation: "Creación de archivo",
    template_new: "plantilla de nuevo archivo",
    template_new_help: "Cuando se está creando una nota a partir de un artículo esto se procesa.",
    template_paste: "plantilla de pegar artículo",
    template_paste_help: "Cuando se está pegando/copiando un artículo esto se procesa.",
    available_variables: "Las variables disponibles son",
    file_location: "Ubicación por defecto para nuevas notas",
    file_location_help: "Donde se ubican las nuevas notas creadas",
    file_location_default: "En la carpeta por defecto",
    file_location_custom: "En la carpeta especificada debajo",
    file_location_folder: "Carpeta para crear los nuevos artículos dentro",
    file_location_folder_help: "los nuevos artículos creados aparecerán en esta carpeta",

    date_format: "Formato de fecha",
    syntax_reference: "Referencia de sintaxis",
    syntax_looks: "Tu sintaxis actual se ve así: ",

    ask_filename: "Solicitar un nombre de archivo",
    ask_filename_help: "Desactivar para aplicar la plantilla debajo automáticamente (removiendo los símbolos inválidos)",
    refresh_time: "Tiempo de actualización",
    refresh_time_help: "Con qué frecuencia se deberían actualizar los feeds, en minutos, usa 0 para desactivar",
    specify_positive_number: "por favor especifica un número positivo",
    multi_device_usage: "Uso multi dispositivo",
    multi_device_usage_help: "Mantener el estado del artículo sincronizado cuando estén usándose múltiples dispositivos al mismo tiempo\n(Requiere un reinicio para efectivizarse)",

    add_new_filter: "Agregar una nueva carpeta filtrada",
    filter_exists: "ya posees un filtro configurado con ese nombre",
    hotkeys: "Atajos",
    hotkeys_reading: "leyendo un artículo",
    press_key: "presiona una tecla",
    customize_hotkey: "personaliza este atajo",

    refreshed_feeds: "Feeds actualizados",

    //import modal
    import: "Importar",
    import_opml: "Importar desde OPML",
    imported_x_feeds: "Importados %1 feeds",
    choose_file: "Elegir archivo",
    choose_file_help: "Elegir archivo a importar",
    export_opml: "Exportar como OPML",

    default_filename: "Plantilla para nombre de archivo",
    default_filename_help: "Todas las variables de la plantilla de pegar artículo están disponibles",

    //cleanup modal
    cleanup: "Limpiar artículos",
    cleanup_help: "Borra las entradas que cumplan con los criterios especificados debajo.",
    cleanup_help2: "Ten presente que los artículos que todavía existe en el feed reaparecerán en la próxima actualización",
    perform_cleanup: "Realizar limpieza",
    all: "Todos",
    from_feed: "desde feed",
    older_than: "de más de X Días",
    older_than_help: "mantener vacío para todos, será ignorado si no hay una fecha de publicación asociada con la entrada",
    advanced: "Avanzado",
    remove_wrong_feed: "Borrar todos los artículos que estén en el feed incorrecto",
    remove_wrong_feed_help: "Esto puede haber sucedido debido a un bug de versiones previas a 0.8",
    scanning_items: "Analizando artículos (%1 / %2)",

    created_export: "Creado el archivo OPML en la carpeta raíz de tu Vault",
    add: "Agregar",
    from_archive: "Obtener artículos viejos desde archive.org",
    reading_archive: "Leyendo datos desde archive",
    scanning_duplicates: "Buscando duplicados",
    do_not_close: "Por favor no cierres esta ventana",

    display_style: "Estilo de Visualización",
    list: "Lista",
    cards: "Tarjetas",

    customize_terms: "Personalizar Términos",
    content: "Contenido",
    highlight: "Resaltar",
    highlight_remove: "Quitar resaltado",

    filter_folder_ignore_help: "ignorar las siguientes carpetas",
    filter_feed_ignore_help: "ignorar los siguientes feeds",
    filter_tags_ignore_help: "ignorar las siguientes etiquetas",

    loading: "Cargando",

    //template settings
    article_title: "Título",
    article_link: "Vínculo al artículo",
    article_author: "Autor del artículo",
    article_published: "Fecha de publicación",
    article_description: "Descripción breve del artículo",
    article_content: "Contenido del artículo",
    article_tags: "Etiquetas separadas por coma",
    article_media: "vínculo al archivo de video/audio",
    feed_folder: "Carpeta del feed",
    feed_title: "Título del feed",
    highlights: "Resaltados",
    note_created: "Fecha de creación de la nota",
    filename: "Nombre de archivo",

    misc: "Misc",

    display_media: "Incluir Media",
    base_folder: "Carpeta base",

    provider: "Proveedor"
}
