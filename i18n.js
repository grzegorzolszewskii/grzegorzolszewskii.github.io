(function(){
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'pl';

  // Teksty wspolne dla wszystkich stron. Kazda strona dokłada swoje
  // w window.PAGE_I18N (patrz skrypt przed <script src="i18n.js">).
  var common = {
    pl: {
      'lang.groupLabel': 'Wybór języka',
      'nav.back': 'Strona główna',
      'meta.ogLocale': 'pl_PL'
    },
    en: {
      'lang.groupLabel': 'Language selection',
      'nav.back': 'Home',
      'meta.ogLocale': 'en_US'
    }
  };

  var page = window.PAGE_I18N || {};
  var translations = {};
  Object.keys(common).forEach(function(lang){
    var dict = {};
    Object.keys(common[lang]).forEach(function(k){ dict[k] = common[lang][k]; });
    Object.keys(page[lang] || {}).forEach(function(k){ dict[k] = page[lang][k]; });
    translations[lang] = dict;
  });

  function store(lang){
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e) {}
  }

  function initialLang(){
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (translations[fromUrl]) return fromUrl;
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (translations[saved]) return saved;
    } catch(e) {}
    var browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return translations[browser] ? browser : DEFAULT_LANG;
  }

  function setMeta(selector, value){
    if (value == null) return;
    var el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }

  function apply(lang){
    var dict = translations[lang] || translations[DEFAULT_LANG];

    document.documentElement.lang = lang;
    if (dict['meta.title']) document.title = dict['meta.title'];
    setMeta('meta[name="description"]', dict['meta.description']);
    setMeta('meta[property="og:title"]', dict['meta.ogTitle']);
    setMeta('meta[property="og:description"]', dict['meta.ogDescription']);
    setMeta('meta[property="og:locale"]', dict['meta.ogLocale']);

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var value = dict[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var value = dict[el.dataset.i18nHtml];
      if (value != null) el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
      var value = dict[el.dataset.i18nAlt];
      if (value != null) el.alt = value;
    });
    document.querySelectorAll('[data-i18n-label]').forEach(function(el){
      var value = dict[el.dataset.i18nLabel];
      if (value != null) el.setAttribute('aria-label', value);
    });

    document.querySelectorAll('.lang-switch button').forEach(function(btn){
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });
  }

  document.querySelectorAll('.lang-switch button').forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.dataset.lang;
      store(lang);
      apply(lang);
    });
  });

  apply(initialLang());
})();
