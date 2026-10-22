"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Language = "NL" | "EN";
const LanguageContext = createContext({
  language: "NL" as Language,
  toggleLanguage: () => {},
  t: (nl: string, en?: string) => nl,
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("NL");
  useEffect(() => {
    try {
      if (localStorage.getItem("dbb_language") === "EN") setLanguage("EN");
    } catch {
      /* Private browsing may disable storage. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);
  function toggleLanguage() {
    const next = language === "NL" ? "EN" : "NL";
    setLanguage(next);
    try {
      localStorage.setItem("dbb_language", next);
    } catch {
      /* Language still works for this visit. */
    }
  }
  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        t: (nl, en) => (language === "EN" && en?.trim() ? en : nl),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
