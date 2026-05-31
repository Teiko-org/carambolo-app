import { useTranslation } from "react-i18next";

/**
 * Hook de conveniência para acessar o idioma atual e trocá-lo.
 *
 * Uso:
 *   const { locale, changeLocale, supportedLocales } = useLocale();
 *   changeLocale("en");
 */
export const SUPPORTED_LOCALES = [
  { code: "pt-BR", label: "Português" },
  { code: "en", label: "English" },
];

export function useLocale() {
  const { i18n } = useTranslation();

  return {
    locale: i18n.language,
    changeLocale: (code) => i18n.changeLanguage(code),
    supportedLocales: SUPPORTED_LOCALES,
  };
}
