export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",

    RSS_Reader: "RSS Reader",
    RSS_Feeds: "RSS Feeds",

    //commands
    open: "Открыть",
    refresh_feeds: "Обновить каналы",
    create_all: "Создать все",

    //folder actions
    mark_all_as_read: "Пометить все прочитанным",
    add_tags_to_all: "Добавить теги ко всем записям",

    filtered_folders: "Отфильтрованная папка",
    folders: "Папки",
    folder: "Папка",
    feeds: "Записи",

    //article actions
    create_note: "создать новую заметку",
    paste_to_note: "вставить в текущую заметку",
    copy_to_clipboard: "скопировать в буфер обмена",
    open_browser: "открыть в браузере",
    edit_tags: "изменить теги",
    mark_as_read: "Пометить прочитанным",
    mark_as_unread: "Пометить непрочитанным",
    mark_as_favorite: "пометить избранным",
    remove_from_favorites: "удалить из избранного",
    read_article_tts: "озвучить с помощью TTS",
    next: "следующая",
    previous: "предыдущая",

    mark_as_read_unread: "пометить как прочитано/непрочитано",
    mark_as_favorite_remove: "отметить как избранное/удалить из избранного",

    //action notifications
    marked_as_read: "пометил пункт как прочитанный",
    marked_as_unread: "пометил пункт как не прочитанный",
    removed_from_favorites: "удалил элемент из избранного",
    added_to_favorites: "пометил элемент как избранное",

    read: "прочитано",
    unread: "не прочитано",
    favorites: "Избранное",
    favorite: "Избранное",
    tags: "Теги",
    tag: "Тег",

    //base modal
    save: "Сохранить",
    cancel: "Отменить",
    delete: "Удалить",
    edit: "Редактировать",
    reset: "востановить по умолчанию",
    fix_errors: "Пожайлуста исправьте ошибки перед сохрананением.",

    add_new: "Добавить новую",

    //feed settings
    add_new_feed: "Добавить новую ленту",
    feed_already_configured: "у вас уже есть канал, настроенный на этот адрес url",
    no_folder: "Нет папки",

    //feed creation modal
    name: "Имя",
    name_help: "Как вы хотите, чтобы эта лента отображалась?",
    url_help: "Какой URL-адрес у этой ленты?",
    folder_help: "К какой категории вы относите эту ленту?",

    invalid_name: "необходимо указать имя",
    invalid_url: "Этот адрес(URL) недействителен",
    invalid_feed: "В этой ленте нет записей",

    //filter types
    filter_tags: "Все статьи с тегами",
    filter_unread: "Все непрочитанные статьи (из папок)",
    filter_read: "Все прочитанные статьи (из папок)",
    filter_favorites: "Избранное (из папок)",

    //sort order
    sort_date_newest: 'Дата публикации (от новой до старой)',
    sort_date_oldest: 'Дата публикации (от старой до новой)',
    sort_alphabet_normal: 'Имя (от А до Я)',
    sort_alphabet_inverted: 'Имя (от Я до А)',
    sort: 'Порядок',

    //filter creation modal
    filter_name_help: 'Как вы хотите, чтобы этот фильтр отображался?',
    filter_type: 'Тип',
    filter_type_help: 'Тип фильтра',
    filter: 'Фильтр',
    filter_help: 'Папки/теги для фильтрации, разделения по ,',
    only_favorites: 'Показывать только избранное',
    show_read: "Показать прочитанное",
    show_unread: "Показать не прочитанное",
    filter_folder_help: "Показывайте только статьи из следующих папок",
    filter_feed_help: "Показывайте только статьи из следующих лент",
    filter_tags_help: "Показывайте только статьи из следующих тег",

    from_folders: "из папки: ",
    from_feeds: "из ленты: ",
    with_tags: "с тегом: ",

    no_feed_with_name: "Не существует ленты с таким названием",
    invalid_tag: "Это недопустимый тег",

    note_exists: "уже есть заметка с таким названием",
    invalid_filename: "имя файла недействительно",

    specify_name: "Пожалуйста, укажите имя файла",
    cannot_contain: "не может содержать:",
    created_note: "Созданная заметка из статьи",
    inserted_article: "вставил статью в заметку",
    no_file_active: "файл не активен",


    //settings
    settings: "Настройки",
    file_creation: "Файл создан",
    template_new: "новый шаблон файла",
    template_new_help: "При создании заметки из статьи это обрабатывается.",
    template_paste: "вставить шаблон статьи",
    template_paste_help: "При вставке/копировании статьи это обрабатывается.",
    available_variables: "Доступны следующие переменные:",
    file_location: "Место по умолчанию для новых заметок",
    file_location_help: "Куда помещаются вновь созданные заметки",
    file_location_default: "В папке по умолчанию",
    file_location_custom: "В папке, указанной ниже",
    file_location_folder: "Папка для создания новых статей",
    file_location_folder_help: "Вновь созданные статьи будут появляться в этой папке",

    date_format: "Формат даты",
    syntax_reference: "Справочник по синтаксису",
    syntax_looks: "Ваш текущий синтаксис выглядит следующим образом: ",

    ask_filename: "Задайте имя файла",
    ask_filename_help: "Отключите автоматическое применение приведенного ниже шаблона (с удалением недопустимых символов)",
    refresh_time: "Время обновления",
    refresh_time_help: "Как часто должна обновляться лента, в минутах, используйте 0, чтобы отключить.",
    specify_positive_number: "пожалуйста, укажите положительное число",
    multi_device_usage: "Использование нескольких устройств",
    multi_device_usage_help: "Сохраняйте статус статьи синхронизированным при одновременном использовании нескольких устройств\n(Требуется перезагрузка для вступления в силу)",

    add_new_filter: "Добавление новой отфильтрованной папки",
    filter_exists: "у вас уже есть фильтр с таким именем",
    hotkeys: "Горячие клавиши",
    hotkeys_reading: "при чтении статьи",
    press_key: "нажать клавишу",
    customize_hotkey: "настройка этой горячей клавиши",

    refreshed_feeds: "Обновление каналов",

    //import modal
    import: "Импорт",
    import_opml: "Импорт из OPML",
    imported_x_feeds: "Импортирована %1 лента",
    choose_file: "Выбереите файл",
    choose_file_help: "Выберите файл для импорта",
    export_opml: "Экспортировать как OPML",

    default_filename: "Шаблон для файлов",
    default_filename_help: "Все переменные из шаблона вставки доступны",

    //cleanup modal
    cleanup: "Очистка статей",
    cleanup_help: "Удаляет записи, соответствующие критериям, указанным ниже.",
    cleanup_help2: "Имейте в виду, что статьи, которые все еще существуют в ленте, появятся при следующем обновлении.",
    perform_cleanup: "Выполните очистку",
    all: "все",
    from_feed: "из ленты",
    older_than: "старше чем X Дней",
    older_than_help: "оставить пустым для всех, будет игнорироваться, если нет даты публикации, связанной с записью",
    advanced: "Расширенный",
    remove_wrong_feed: "Удалите все статьи, которые находятся в неправильной ленте",
    remove_wrong_feed_help: "Это могло произойти из-за ошибки в версиях до 0.8.",
    scanning_items: "Сканирование статей (%1 / %2)",

    created_export: "Созданный файл OPML в корневой папке хранилища",
    add: "Добавить",
    from_archive: "Получайте старые статьи с сайта archive.org",
    reading_archive: "Чтение данных из архива",
    scanning_duplicates: "Сканирование для поиска дубликатов",
    do_not_close: "Пожалуйста, не закрывайте это окно",

    display_style: "Стиль отображения",
    list: "Список",
    cards: "Карточки",

    customize_terms: "Персонализация условий",
    content: "Контент",
    highlight: "Выделение",
    highlight_remove: "убрать выделение",

    filter_folder_ignore_help: "не обращайте внимания на следующие папки",
    filter_feed_ignore_help: "не обращайте внимания на следующие ленты",
    filter_tags_ignore_help: "не обращайте внимания на следующие теги",

    loading: "Загрузка",

    //template settings
    article_title: "Заголовок",
    article_link: "Ссылка на заголовок",
    article_author: "Автор заголовка",
    article_published: "Дата публикации",
    article_description: "Краткое описание статьи",
    article_content: "содержание статьи",
    article_tags: "Теги, разделенные запятой",
    article_media: "Ссылка на видео/аудиофайл",
    feed_folder: "Папка с лентами",
    feed_title: "Заголовок ленты",
    highlights: "Выделение",
    note_created: "Дата создания заметки",
    filename: "Имя файла",

    misc: "Разное",

    display_media: "Включить медиа",
    base_folder: "Базовая папка",

    provider: "Поставщик"
}
