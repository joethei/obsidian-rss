export default {
    //these values are only used in testing, don't overwrite them
    testingValue: "",
    testingInserts: "",

    RSS_Reader: "Leitor RSS",
    RSS_Feeds: "Feed RSS",

    //commands
    open: "Abrir",
    refresh_feeds: "Atualizar feed",
    create_all: "Criar todos",

    //folder actions
    mark_all_as_read: "Marcar todos como lidos",
    add_tags_to_all: "Adicionar tags para todos os artigos",

    filtered_folders: "Pastas filtradas",
    folders: "Pastas",
    folder: "Pasta",
    feeds: "Feeds",

    //article actions
    create_note: "criar uma nova nota",
    paste_to_note: "colar na nota atual",
    copy_to_clipboard: "copiar para área de transferência",
    open_browser: "abrir no navegador",
    edit_tags: "editar tags",
    mark_as_read: "marcar como lido",
    mark_as_unread: "marcar como não lido",
    mark_as_favorite: "marcar como favorito",
    remove_from_favorites: "remover dos favoritos",
    read_article_tts: "ler artigo com TTS",
    next: "próximo",
    previous: "anterior",

    mark_as_read_unread: "marcar como lido/não lido",
    mark_as_favorite_remove: "marcar como favorito/remover dos favoritos",

    //action notifications
    marked_as_read: "item marcado como lido",
    marked_as_unread: "item marcado como não lido",
    removed_from_favorites: "item removido dos favoritos",
    added_to_favorites: "item marcado como favorito",

    read: "lido",
    unread: "não lido",
    favorites: "Favoritos",
    favorite: "Favorito",
    tags: "Tags",
    tag: "Tag",

    //base modal
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Remover",
    edit: "Editar",
    reset: "restaurar padrão",
    fix_errors: "Por favor corrija erros antes de salvar",

    add_new: "Adicionar novo",

    //feed settings
    add_new_feed: "Adicionar novo feed",
    feed_already_configured: "você já possui um feeed configurado com esta URL",
    no_folder: "Nenhuma pasta",

    //feed creation modal
    name: "Nome",
    name_help: "Com qual nome você quer que este feed seja mostrado?",
    url_help: "Qual é o URL deste feed?",
    folder_help: "Como você categoriza este feed?",

    invalid_name: "você precisa especificar um nome",
    invalid_url: "esta url não é válido",
    invalid_feed: "Este feed não possui nenhum artigo",

    //filter types
    filter_tags: "Todos os artigos com tags",
    filter_unread: "Todos os artigos não lidos (de pastas)",
    filter_read: "Todos os artigos lidos (de pastas)",
    filter_favorites: "Favoritos(de pastas)",

    //sort order
    sort_date_newest: 'Data de publicação (novo para antigo)',
    sort_date_oldest: 'Data de publicação (antigo para novo)',
    sort_alphabet_normal: 'Nome (A à Z)',
    sort_alphabet_inverted: 'Nome (Z à A)',
    sort: 'Ordenar por',

    //filter creation modal
    filter_name_help: 'Com qual nome você quer que este filtro seja mostrado?',
    filter_type: 'Tipo',
    filter_type_help: 'Tipo de filtro',
    filter: 'Filtro',
    filter_help: 'Pastas/Tags para que seja filtrado, dividido, ',
    only_favorites: 'Mostrar apenas favoritos',
    show_read: "Mostrar lidos",
    show_unread: "Mostrar não lidos",
    filter_folder_help: "Apenas mostrar artigos das seguintes pastas",
    filter_feed_help: "Apenas mostrar artigos dos seguintes feeds",
    filter_tags_help: "Apenas mostrar artigos com as seguintes tags",

    from_folders: "das pastas: ",
    from_feeds: "dos feeds: ",
    with_tags: "com as tags: ",

    no_feed_with_name: "Não existe um feed com este nome",
    invalid_tag: "Esta não é uma tag válida",

    note_exists: "já existe uma nota com este nome",
    invalid_filename: "este nome de arquivo não é válido",

    specify_name: "Por favor especifique um nome de arquivo",
    cannot_contain: "Não pode conter:",
    created_note: "Nota criada de artigo",
    inserted_article: "artigo inserido em nota",
    no_file_active: "nenhum arquivo ativo",


    //settings
    settings: "Configurações",
    file_creation: "Criação de arquivo",
    template_new: "Novo modelo de arquivo",
    template_new_help: "Quando é criado uma nota de um artigo, este modelo é processado.",
    template_paste: "Colar modelo de artigo",
    template_paste_help: "Quando é colado/copiado um artigo, este modelo é processado.",
    available_variables: "Variáveis disponíveis são:",
    file_location: "Local padrão para novas notas",
    file_location_help: "Onde notas recentemente criadas são colocadas",
    file_location_default: "Em uma pasta padrão",
    file_location_custom: "Na pasta especificada abaixo",
    file_location_folder: "Pasta onde será criada novos artigos",
    file_location_folder_help: "artigos recentemente criados irão aparecer nesta pasta",

    date_format: "Formato de data",
    syntax_reference: "Referência de sintaxe",
    syntax_looks: "Sua sintaxe atual é exibida como: ",

    ask_filename: "Perguntar por nome de arquivo",
    ask_filename_help: "Desativar para aplicar o modelo abaixo automaticamente (com símbolos inválidos removidos)",
    refresh_time: "Tempo de atualização",
    refresh_time_help: "Quão frequente os feeds devem ser atualizados, em minutos. Use 0 para desativar",
    specify_positive_number: "por favor especifique um número positivo",
    multi_device_usage: "Uso em múltiplos dispositivos",
    multi_device_usage_help: "Mantenha os status de artigos sincronizados usando múltiplos dispositivos ao mesmo tempo\n (Necessário reiniciar para ser efetivo)",

    add_new_filter: "Adicionar nova pasta filtrada",
    filter_exists: "você já possui um filtro configurado com este nome",
    hotkeys: "atalho",
    hotkeys_reading: "Lendo um artigo",
    press_key: "Pressione uma tecla",
    customize_hotkey: "Customizar este atalho",

    refreshed_feeds: "Feeds atualizados",

    //import modal
    import: "Importar",
    import_opml: "Importar de OPML",
    imported_x_feeds: "Importado %1 feeds",
    choose_file: "Escolha arquivo",
    choose_file_help: "Escolha arquivo para importar",
    export_opml: "Exportar como OPML",

    default_filename: "Modelo para arquivo",
    default_filename_help: "Todas as váriaveis do modelo colado está disponíveis",

    //cleanup modal
    cleanup: "Limpeza de artigos",
    cleanup_help: "Remova artigso que se encaixem em critério especificado abaixo.",
    cleanup_help2: "Tenha em mente que artigos que ainda existam no feed irão reaparecer na próxima atualização",
    perform_cleanup: "Realizar limpeza",
    all: "todos",
    from_feed: "de feed",
    older_than: "anteriores à X Days",
    older_than_help: "matem vazio para todos, será ignorado se nenhuma data de publicação estiver associado ao artigo",
    advanced: "Avançado",
    remove_wrong_feed: "Remover todos os artigos que estiverem em feed incorreto",
    remove_wrong_feed_help: "Isso pode ter acontecido devido a bug in versões pré 0.8",
    scanning_items: "Escaneando artigos (%1 / %2)",

    created_export: "Arquivo OPML criado em sua pasta raiz do Cofre",
    add: "Adicionar",
    from_archive: "Obtenha artigos antigos do archive.org",
    reading_archive: "Lendo dados do arquivo",
    scanning_duplicates: "Escaneando por duplicatas",
    do_not_close: "Por favor não feche esta janela",

    display_style: "Estilo de visualizaçãoDisplay Style",
    list: "Lista",
    cards: "Cartões",

    customize_terms: "Customizar Termos",
    content: "Conteúdo",
    highlight: "Destaque",
    highlight_remove: "remover destaque",

    filter_folder_ignore_help: "ignorar as seguintes pastas",
    filter_feed_ignore_help: "ignorar os seguintes feeds",
    filter_tags_ignore_help: "ignorar as seguintes tags",

    loading: "Carregando",

    //template settings
    article_title: "Título",
    article_link: "Link para artigo",
    article_author: "Autor de artigo",
    article_published: "Data publicada",
    article_description: "Descrição curta de artigo",
    article_content: "conteúdo de artigo",
    article_tags: "Tags divididas por vírgula",
    article_media: "Link para arquivo de vídeo/áudio",
    feed_folder: "Pasta de feed",
    feed_title: "Título de feed",
    highlights: "Destaques",
    note_created: "Data de criação da nota",
    filename: "Nome do arquivo",

    misc: "Outros",

    display_media: "Incluir mídia",
    base_folder: "Pasta base",

    provider: "Provedor"
}
