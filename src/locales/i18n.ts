import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import { getCookie, setCookie } from '@/utils';


import en_US from './en_US.json';
import zh_CN from './zh_CN.json';
import zh_TW from './zh_TW.json';
import ja_JP from './ja_JP.json';
import es_ES from './es_ES.json';
import pt_BR from './pt_BR.json';
import ru_RU from './ru_RU.json';
import fr_FR from './fr_FR.json';
import de_DE from './de_DE.json';

export const i18nLangMap: Record<string, string> = {
  de: 'de_DE',
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  id: 'id_ID',
  jp: 'ja_JP',
  pt: 'pt_BR',
  ru: 'ru_RU',
  cn: 'zh_CN',
  tw: 'zh_TW',
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en_US },
    cn: { translation: zh_CN },
    tw: { translation: zh_TW },
    jp: { translation: ja_JP },
    es: { translation: es_ES },
    pt: { translation: pt_BR },
    ru: { translation: ru_RU },
    fr: { translation: fr_FR },
    de: { translation: de_DE },
  },
  fallbackLng: 'en',
  preload: ['en'],
  interpolation: {
    escapeValue: false,
  },
});

/** @在此执行此代码在使用时会造成水合错误需要在客户端执行 **/

// if (typeof window !== 'undefined') {
//   let cookieLocale = getCookie('locale');
//   if (!cookieLocale) {
//     cookieLocale = navigator.language;
//     if (cookieLocale) {
//       cookieLocale = cookieLocale.replace('-', '_');
//     }
//   }
//   if (!cookieLocale) {
//     cookieLocale = 'en_US';
//   }
//   setCookie('locale', cookieLocale);
//   const langKey = Object.keys(i18nLangMap).find(key => i18nLangMap[key] === cookieLocale) || 'en';
//   i18n.changeLanguage(langKey);
// }

export default i18n;
