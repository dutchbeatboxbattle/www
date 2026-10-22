"use client";
import { sitePath, isSafeLink } from "@/lib/site-path";
import { useLanguage } from "@/lib/LanguageContext";

import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero({ joinUrl }: { joinUrl?: string }) {
  const link = joinUrl?.trim();
  const href = link && isSafeLink(link) ? sitePath(link) : undefined;
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a00] to-black">
        {/* Placeholder for background image */}
        <div
          style={{
            backgroundImage: `url(${sitePath("/hero-placeholder.jpg")})`,
          }}
          className="absolute inset-0 bg-cover bg-center opacity-40"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        {/* Orange accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6B00] rounded-full blur-[200px] opacity-20" />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src={sitePath("/logo-dbb.png")}
            alt="Dutch Beatbox Battle logo"
            className="w-48 md:w-64 h-auto object-contain logo-glow-pulse"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 text-shadow-glow tracking-tight">
          DUTCH BEATBOX
          <span className="block text-gradient-orange">BATTLE</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-4 font-light tracking-wide">
          {t(
            "Het officiële Nederlands Kampioenschap Human Beatbox",
            "The official Dutch Human Beatbox Championship",
          )}
        </p>

        {/* Tagline */}
        <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
          {t(
            "Van battles en jams tot academy en live sessions: DBB brengt de Nederlandse beatboxcommunity samen en geeft nieuw talent een podium.",
            "From battles and jams to the academy and live sessions: DBB brings the Dutch beatbox community together and gives new talent a stage.",
          )}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="xl"
            className="group"
            onClick={() =>
              document
                .getElementById("road-to-dbb")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>{t("Bekijk Events", "View Events")}</span>
            <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </Button>

          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className={buttonVariants({ size: "xl", variant: "outline" })}>
              {t("Doe Mee", "Join In")}
            </a>
          ) : (
            <Button size="xl" variant="outline" disabled
              className="border-zinc-700 bg-zinc-900 text-zinc-500 disabled:opacity-100"
              title={t("Er is momenteel geen evenement om aan deel te nemen", "There is currently no event open for participation")}>
              {t("Doe Mee", "Join In")}
            </Button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-[#FF6B00]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
      <div
        className="absolute top-40 right-20 w-3 h-3 bg-[#FF6B00] rounded-full animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      />
    </section>
  );
}
