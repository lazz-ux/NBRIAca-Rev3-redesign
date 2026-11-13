import { useRouter } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import * as React from "react";

import { LANG_COOKIE, parseLang, pick, type Lang, type Text } from "./text";

export type { Lang } from "./text";

/**
 * Reads the visitor's language choice from a cookie, on the server during SSR
 * and from `document.cookie` in the browser, so the first HTML is already in
 * the right language (no flash of English for Indonesian visitors).
 */
export const readLang = createIsomorphicFn()
  .server(() => parseLang(getCookie(LANG_COOKIE)))
  .client(() =>
    parseLang(
      document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]*)`))?.[1],
    ),
  );

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = React.createContext<LangContextValue | null>(null);

export function LangProvider({
  initial,
  children,
}: {
  initial: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = React.useState<Lang>(initial);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = React.useMemo<LangContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        setLangState(next);
        // Re-run route context and head() so page titles follow the language.
        void router.invalidate();
      },
    }),
    [lang, router],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/**
 * `t(en, id)` picks inline copy, `tr(text)` picks bilingual fixture copy.
 * Outside the provider (isolated tests) it falls back to English.
 */
export function useLang() {
  const ctx = React.useContext(LangContext);
  const lang = ctx?.lang ?? "en";
  return {
    lang,
    setLang: ctx?.setLang ?? (() => {}),
    t: (en: string, id: string) => (lang === "id" ? id : en),
    tr: (text: Text) => pick(text, lang),
  };
}
