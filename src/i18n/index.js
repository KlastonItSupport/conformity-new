import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import PTBR from "./locales/pt/pt-br.json";
import ENUS from "./locales/en/en-us.json";
import ES from "./locales/es/es.json";

const languageKey = "@Conformity:language";
const language = localStorage.getItem(languageKey);

const selectedLanguage = language || window.navigator.language;

const resources = {
  pt: PTBR,
  en: ENUS,
  es: ES,
};

console.log("Selected language from localStorage:", selectedLanguage);

i18n.use(initReactI18next).init({
  resources: resources,
  lng: selectedLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
