import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import ptBR from "../locales/pt-BR.json";
import en from "../locales/en.json";

const resources = {
  "pt-BR": { translation: ptBR },
  pt: { translation: ptBR },
  en: { translation: en },
};

// Pega o locale do dispositivo (ex: "pt-BR", "en-US")
const deviceLocale = Localization.getLocales()?.[0]?.languageTag ?? "pt-BR";

// Resolve para um dos idiomas suportados; fallback para pt-BR
function resolveLanguage(tag) {
  if (resources[tag]) return tag;
  const short = tag.split("-")[0]; // "pt-BR" → "pt"
  if (resources[short]) return short;
  return "pt-BR";
}

i18n.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(deviceLocale),
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false, // React já escapa por padrão
  },
  compatibilityJSON: "v4",
});

export default i18n;
