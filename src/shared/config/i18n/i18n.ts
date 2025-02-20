import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

type Langs = 'en' | 'ru';
const supportedLngs: Langs[] = ['en', 'ru'];
export const i18nNamespace = {
    landing: 'landing',
};

//TODO: add i18n

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ru',
        // debug: true,
        interpolation: {
            escapeValue: false,
        },
        supportedLngs,
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
    });
