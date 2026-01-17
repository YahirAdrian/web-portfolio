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


       
       
 // Custom language selector logic
    (function() {
      const selector = document.getElementById('custom-language-selector');
      if (!selector) return;
      const button = selector.querySelector('#selected-language');
      const options = selector.querySelector('#language-options');
      const optionItems = options.querySelectorAll('li');

      // Helper to update button UI
      function updateButtonUI(selectedItem) {
        const img = selectedItem.querySelector('img').cloneNode(true);
        const span = selectedItem.querySelector('span').cloneNode(true);
        button.innerHTML = '';
        button.appendChild(img);
        button.appendChild(span);
        // Add dropdown arrow
        const arrow = document.createElement('svg');
        arrow.className = 'ml-1 w-4 h-4';
        arrow.setAttribute('fill', 'none');
        arrow.setAttribute('stroke', 'currentColor');
        arrow.setAttribute('viewBox', '0 0 24 24');
        arrow.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>';
        button.appendChild(arrow);
      }

      // Toggle dropdown
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        options.classList.toggle('hidden');
      });

      // Select language
      optionItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const languageSelected = item.dataset.lang;
          loadLanguage(languageSelected);

          updateButtonUI(item);
          options.classList.add('hidden');
        });
      });

      // On page load, update selector based on query param or localStorage
      function getInitialLang() {
        const params = new URLSearchParams(window.location.search);
        return params.get('lang') ||
          localStorage.getItem('lang') ||
          DEFAULT_LANG;
      }

      const initialLang = getInitialLang();
      const initialItem = Array.from(optionItems).find(
        item => item.dataset.lang === initialLang
      );
      if (initialItem) {
        updateButtonUI(initialItem);
      }
    })();

    