"use client";
import { useLanguage } from "@/lib/LanguageContext";
export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();
  const english = language === "NL";
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={english ? "Switch to English" : "Schakel naar Nederlands"}
      title={english ? "English" : "Nederlands"}
      className="mx-3 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-bold text-white transition hover:border-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 30 20"
        className="h-4 w-6 rounded-sm"
      >
        {english ? (
          <>
            <path fill="#fff" d="M0 0h30v20H0z" />
            <path fill="#ce1124" d="M12 0h6v20h-6z" />
            <path fill="#ce1124" d="M0 7h30v6H0z" />
          </>
        ) : (
          <>
            <path fill="#ae1c28" d="M0 0h30v7H0z" />
            <path fill="#fff" d="M0 7h30v6H0z" />
            <path fill="#21468b" d="M0 13h30v7H0z" />
          </>
        )}
      </svg>
      <span>{english ? "EN" : "NL"}</span>
    </button>
  );
}
