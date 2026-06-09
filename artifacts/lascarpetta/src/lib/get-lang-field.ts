import { Language } from "./i18n-context";

/**
 * Helper to get the localized field from an API object based on the current language.
 * E.g. getLangField(dish, "name", lang) -> returns dish.nameRu, dish.nameIt, etc.
 */
export function getLangField<T extends Record<string, any>>(
  obj: T,
  baseField: string,
  lang: Language
): string {
  if (!obj) return "";
  
  // Capitalize first letter of language code for the field suffix
  const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
  const fieldName = `${baseField}${suffix}`;
  
  // Fallback to Ru, then En, then just return whatever is there or empty string
  return obj[fieldName] || obj[`${baseField}Ru`] || obj[`${baseField}En`] || "";
}
