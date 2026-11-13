/** Supported interface languages. English is the default. */
export type Lang = "en" | "id";

/** A piece of copy in both languages. */
export interface L {
  en: string;
  id: string;
}

/** Copy that is either language-neutral (names, titles) or translated. */
export type Text = string | L;

export function pick(text: Text, lang: Lang) {
  return typeof text === "string" ? text : text[lang];
}

/** Shorthand for writing bilingual fixture copy. */
export const l = (en: string, id: string): L => ({ en, id });

export function parseLang(value: unknown): Lang {
  return value === "id" ? "id" : "en";
}

export const LANG_COOKIE = "nbri-lang";
