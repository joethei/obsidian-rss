export default {
    RSS_Reader: "RSS Reader",
    RSS_Feeds: "订阅源",

    //commands
    open: "打开",
    refresh_feeds: "更新订阅",
    create_all: "创建全部",

    //folder actions
    mark_all_as_read: "全部标记为已读",
    add_tags_to_all: "为所有条目添加标签",

    filtered_folders: "筛选分类",
    folders: "分类",
    folder: "分类",
    feeds: "订阅源",

    //article actions
    create_note: "新建笔记",
    paste_to_note: "粘贴到当前笔记",
    copy_to_clipboard: "复制到剪切板",
    open_browser: "用浏览器打开",
    edit_tags: "编辑标签",
    mark_as_read: "标记为已读",
    mark_as_unread: "标记为未读",
    mark_as_favorite: "添加到收藏夹",
    remove_from_favorites: "从收藏夹中删除",
    read_article_tts: "语音(TTS)阅读文章",
    next: "下一篇",
    previous: "上一篇",

    mark_as_read_unread: "标记为已读/未读",
    mark_as_favorite_remove: "添加到收藏夹/从收藏夹中删除",

    //action notifications
    marked_as_read: "已标记为已读",
    marked_as_unread: "已标记为未读",
    removed_from_favorites: "已从收藏夹中删除",
    added_to_favorites: "已添加到收藏夹",

    read: "已读",
    unread: "未读",
    favorites: "收藏夹",
    favorite: "收藏",
    tags: "标签",
    tag: "标签",

    //base modal
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    reset: "恢复默认值",
    fix_errors: "请在保存前修复错误。",

    add_new: "添加",

    //feed settings
    add_new_feed: "添加新订阅源",
    feed_already_configured: "您已经添加了该 URL 地址的订阅源",
    no_folder: "未分类",

    //feed creation modal
    name: "名称",
    name_help: "设置订阅源名称",
    url_help: "输入订阅源的 URL 地址",
    folder_help: "设置订阅源分类",

    invalid_name: "请输入订阅源名称",
    invalid_url: "请输入有效的订阅源 URL 地址",
    invalid_feed: "此订阅源没有任何内容",

    //filter types
    filter_tags: "已打标签的文章",
    filter_unread: "全部未读文章(来自分类)",
    filter_read: "全部已读文章(来自分类)",
    filter_favorites: "收藏夹(来自分类)",

    //sort order
    sort_date_newest: '发布日期 (新 → 旧)',
    sort_date_oldest: '发布日期 (旧 to 新)',
    sort_alphabet_normal: '名称 (A → Z)',
    sort_alphabet_inverted: '名称 (Z → A)',
    sort: '排序',

    //filter creation modal
    filter_name_help: '设置筛选器名称',
    filter_type: '类型',
    filter_type_help: '筛选器类型',
    filter: '筛选器',
    filter_help: '要筛选的分类/标签,',
    only_favorites: '仅显示已收藏',
    show_read: "显示已读",
    show_unread: "显示未读",
    filter_folder_help: "仅显示以下分类中的文章",
    filter_feed_help: "仅显示以下订阅源中的文章",
    filter_tags_help: "仅显示以下标签中的文章",

    from_folders: "来自分类: ",
    from_feeds: "来自订阅源: ",
    with_tags: "来自标签: ",

    invalid_tag: "此标签无效",

    note_exists: "已存在同名笔记",
    invalid_filename: "文件名无效",

    specify_name: "请输入文件名",
    cannot_contain: "不能包含: ",
    created_note: "已将该文章复制为笔记",
    inserted_article: "已将该文章复制到当前笔记",
    no_file_active: "没有文件处于活动状态",


    //settings
    settings: "设置",
    file_creation: "新建笔记",
    template_new: "笔记模板",
    template_new_help: "使用订阅文章创建笔记时，会根据已设置的模板变量进行处理。",
    template_paste: "复制/粘贴模板",
    template_paste_help: "将订阅文章复制/粘贴为笔记时，会根据已设置的模板变量进行处理。",
    available_variables: "可用模板变量: ",
    file_location: "保存位置",
    file_location_help: "请选择要保存新建笔记的位置",
    file_location_default: "默认目录",
    file_location_custom: "自定义目录",
    file_location_folder: "请选择要保存新建笔记的目录",
    file_location_folder_help: "新创建的笔记将保存在该目录中",

    date_format: "日期格式",
    syntax_reference: "日期格式语法参考",
    syntax_looks: "当前日期格式: ",

    ask_filename: "确认文件名",
    ask_filename_help: "禁用则自动使用下面的文件名模板创建文件（自动删除无效的文件名字符）",
    refresh_time: "更新频率",
    refresh_time_help: "多久更新一次订阅源（单位: 分钟），设置为0则禁用。",
    specify_positive_number: "请输入正数",
    multi_device_usage: "多设备使用",
    multi_device_usage_help: "同时使用多个设备时保持文章状态同步\n(需要重新启动才能生效)",

    add_new_filter: "添加新筛选器",
    filter_exists: "已存在同名筛选器",
    hotkeys: "快捷键",
    hotkeys_reading: "阅读文章时",
    press_key: "按下快捷键",
    customize_hotkey: "分配快捷键",

    refreshed_feeds: "已更新 RSS 订阅源",

    //import modal
    import: "导入",
    import_opml: "通过 OPML 导入",
    imported_x_feeds: "已导入 %1 条订阅源",
    choose_file: "选择文件",
    choose_file_help: "请选择要导入的文件",
    export_opml: "导出 OPML 文件",

    default_filename: "文件名模板",
    default_filename_help: "上面创建笔记的所有模板变量都可用",

    //cleanup modal
    cleanup: "清除文章",
    cleanup_help: "清除符合以下规则的文章",
    cleanup_help2: "注意，订阅源中仍存在的文章将在下次刷新时重新出现",
    perform_cleanup: "清除文章",
    all: "全部",
    from_feed: "来自订阅源",
    older_than: "多少天之前发布的文章",
    older_than_help: "如果没有符合的文章，则忽略该条规则（为空则保留所有日期的文章）",
    advanced: "高级设置",
    remove_wrong_feed: "清除所有不正确订阅源中的文章",
    remove_wrong_feed_help: "这可能是由于0.8之前版本中的错误造成的",
    scanning_items: "扫描文章 (%1 / %2))",

    created_export: "已在笔记仓库根目录创建 OPML 文件",
    add: "添加",
    from_archive: "从互联网档案馆(archive.org)获取旧文章",
    reading_archive: "正在从存档中读取数据",
    scanning_duplicates: "扫描重复文章",
    do_not_close: "请勿关闭此窗口",

    display_style: "显示风格",
    list: "列表",
    cards: "卡片",

    customize_terms: "自定义术语",
    content: "内容设置",
    highlight: "高亮",
    highlight_remove: "删除高亮",

    filter_folder_ignore_help: "忽略以下分类",
    filter_feed_ignore_help: "忽略以下订阅源",
    filter_tags_ignore_help: "忽略以下标签",

    loading: "正在加载"
}
