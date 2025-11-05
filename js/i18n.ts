// Тип: объект вида { en: { key: "value" }, ru: {...}, ... }
type Translations = Record<string, Record<string, string>>;

// Ключ для хранения языка в localStorage
const LANG_STORAGE_KEY = 'coffeehouse_lang';
// Язык по умолчанию
const DEFAULT_LANG = 'en';

// Текущий язык (берём из localStorage или ставим дефолтный)
let currentLang: string = localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG;
// Сюда загрузятся переводы из JSON
let translations: Translations = {};

// Основная функция — загружает JSON и запускает перевод страницы
export async function initI18n(): Promise<void> {
  try {
    const response = await fetch('./translations/translations.json');
    translations = await response.json();

    translatePage();      // применяем переводы
    setupLangButtons();   // вешаем обработчики на кнопки языков
    updateHtmlLang();     // обновляем <html lang="...">
  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

// --- ОСНОВНАЯ ФУНКЦИЯ ПЕРЕВОДА СТРАНИЦЫ ---
function translatePage(): void {
  // если переводы для текущего языка не найдены — ничего не делаем
  if (!translations[currentLang]) return;

  // находим все элементы, у которых есть хоть один data-i18n-* атрибут
  const allElements = document.querySelectorAll<HTMLElement>(
    '[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-alt], [data-i18n-aria]'
  );

  // один цикл forEach вместо пяти
  allElements.forEach(el => {
    // ищем, какой именно атрибут data-i18n-* есть у элемента
    const attr = Array.from(el.attributes).find(a => a.name.startsWith('data-i18n'))?.name;
    if (!attr) return;

    // получаем ключ перевода (например "heroTitle")
    const key = el.getAttribute(attr);
    const value = key ? translations[currentLang][key] : null;
    if (!value) return;

    // определяем, какой тип перевода применять
    switch (attr) {
      // обычный текст или HTML
      case 'data-i18n':
        // сохраняем оригинальную разметку, если не сохранена (чтобы не потерять теги при повторных заменах)
        if (!el.dataset.originalHtml) el.dataset.originalHtml = el.innerHTML;

        // если внутри элемента есть картинка — заменяем только текст после неё
        if (el.querySelector('img')) {
          el.innerHTML = el.dataset.originalHtml.replace(/([^>]+)$/i, value);
        } else {
          el.textContent = value;
        }

        // если это тег <title> — обновляем заголовок страницы
        if (el.tagName === 'TITLE') document.title = value;
        break;

      // перевод плейсхолдера (placeholder)
      case 'data-i18n-placeholder':
        (el as HTMLInputElement).placeholder = value;
        break;

      // перевод всплывающей подсказки (title)
      case 'data-i18n-title':
        el.title = value;
        break;

      // перевод alt у картинок
      case 'data-i18n-alt':
        (el as HTMLImageElement).alt = value;
        break;

      // перевод aria-label для доступности
      case 'data-i18n-aria':
        el.setAttribute('aria-label', value);
        break;
    }
  });
}

// --- ОБРАБОТКА КНОПОК ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ---
function setupLangButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-lang]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang!;
      // если кликнули по уже активному языку — ничего не делаем
      if (selectedLang === currentLang) return;

      // сохраняем выбранный язык
      currentLang = selectedLang;
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);

      // применяем переводы
      translatePage();
      updateHtmlLang();
      updateActiveButton(btn);
    });

    // при загрузке страницы подсвечиваем активную кнопку
    if (btn.dataset.lang === currentLang) btn.classList.add('active');
  });
}

// Подсветка активной кнопки языка
function updateActiveButton(activeBtn: HTMLButtonElement): void {
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn === activeBtn);
  });
}

// Обновляем атрибут <html lang="..."> для SEO и доступности
function updateHtmlLang(): void {
  document.documentElement.setAttribute('lang', currentLang);
}
