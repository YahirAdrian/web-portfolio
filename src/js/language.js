const DEFAULT_LANG = 'en';
const LANG_PATH = 'lang';

function getQueryLang() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang');
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function warnMissing(key, lang) {
  console.warn(`[i18n] Missing translation "${key}" for language "${lang}"`);
}

function applyTextTranslations(translations, lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = getNestedValue(translations, key);

    if (value) {
      el.textContent = value;
    } else {
      warnMissing(key, lang);
    }
  });
}

function applyAttributeTranslations(translations, lang) {
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const mappings = el.dataset.i18nAttr.split(';');

    mappings.forEach(mapping => {
      const [attr, key] = mapping.split(':').map(s => s.trim());
      const value = getNestedValue(translations, key);

      if (value) {
        el.setAttribute(attr, value);
      } else {
        warnMissing(key, lang);
      }
    });
  });
}

async function loadLanguage(lang) {
  try {
    const res = await fetch(`${LANG_PATH}/${lang}.json`);
    if (!res.ok) throw new Error(`Cannot load ${lang}.json`);

    const translations = await res.json();

    // Apply translations
    applyTextTranslations(translations, lang);
    applyAttributeTranslations(translations, lang);

    // Accessibility
    document.documentElement.lang = lang;

    // Persist preference
    localStorage.setItem('lang', lang);

  } catch (error) {
    console.error(`[i18n] ${error.message}`);

    if (lang !== DEFAULT_LANG) {
      loadLanguage(DEFAULT_LANG);
    }
  }
}

(function initI18n() {
  const lang =
    getQueryLang() ||
    localStorage.getItem('lang') ||
    DEFAULT_LANG;

  loadLanguage(lang);
})();
