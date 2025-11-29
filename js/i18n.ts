type Translations = Record<string, Record<string, string>>;


const LANG_STORAGE_KEY = 'coffeehouse_lang';
const DEFAULT_LANG = 'en';


let currentLang: string = localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG;
let translations: Translations = {};



export async function initI18n(): Promise<void> {
  try {
    const response = await fetch('./translations/translations.json'); 
    
    translations = await response.json(); 

    translatePage();      
    setupLangButtons();  
    updateHtmlLang();     
  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

function translatePage(): void {

  if (!translations[currentLang]) return;

  const allElements = document.querySelectorAll<HTMLElement>(
    '[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-alt], [data-i18n-aria]'
  );

  allElements.forEach(el => {
    const attr = Array.from(el.attributes).find(a => a.name.startsWith('data-i18n'))?.name;

    if (!attr) return; 

    const key = el.getAttribute(attr);

    const value = key ? translations[currentLang][key] : null;
    if (!value) return;

    switch (attr) {
      case 'data-i18n':
        if (!el.dataset.originalHtml) el.dataset.originalHtml = el.innerHTML;

        if (el.querySelector('img')) {
          el.innerHTML = el.dataset.originalHtml.replace(/([^>]+)$/i, value);
        } else {
          el.textContent = value; 
        }  

        if (el.tagName === 'TITLE') document.title = value;
        break;


      case 'data-i18n-placeholder':
        (el as HTMLInputElement).placeholder = value;
        break;

      case 'data-i18n-title':
        el.title = value;
        break;

      case 'data-i18n-alt':
        (el as HTMLImageElement).alt = value;
        break;

      case 'data-i18n-aria':
        el.setAttribute('aria-label', value);
        break;
    }
  });
}

function setupLangButtons(): void {

  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-lang]');


  buttons.forEach(btn => {
    btn.addEventListener('click', () => {

      const selectedLang = btn.dataset.lang!;

      if (selectedLang === currentLang) return;

      currentLang = selectedLang;
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);


      translatePage();
      updateHtmlLang();
      updateActiveButton(btn);
    });

    if (btn.dataset.lang === currentLang) btn.classList.add('active');
  });
}

function updateActiveButton(activeBtn: HTMLButtonElement): void {
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn === activeBtn);
  });
}


function updateHtmlLang(): void {
  document.documentElement.setAttribute('lang', currentLang);
}
