import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import PTBR from "./locales/pt/pt-br.json";
import ENUS from "./locales/en/en-us.json";
import ES from "./locales/es/es.json";

const resources = {
  pt: PTBR,
  en: ENUS,
  es: ES,
};

i18n.use(initReactI18next).init({
  resources: resources,
  //pt, en-US, es
  //   lng: "en-US",
  // lng: "pt",
  //   lng: "es",
  lng: navigator.language,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
