import i18n, { i18nLangMap } from '@/locales/i18n';
import { getCookie, setCookie } from '@/utils';
import { useLayoutEffect } from 'react';

const useInitI18n = () => {
    useLayoutEffect(() => {
        let cookieLocale = getCookie('locale');
        if (!cookieLocale) {
            cookieLocale = navigator.language;
            if (cookieLocale) {
                cookieLocale = cookieLocale.replace('-', '_');
            }
        }
        if (!cookieLocale) {
            cookieLocale = 'en_US';
        }
        setCookie('locale', cookieLocale);
        const langKey = Object.keys(i18nLangMap).find(key => i18nLangMap[key] === cookieLocale) || 'en';
        i18n.changeLanguage(langKey);
    }, []); // 只在组件挂载时执行
};

export default useInitI18n;