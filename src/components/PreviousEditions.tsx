"use client";
import { useLanguage } from "@/lib/LanguageContext";

import React, { useState, useCallback } from "react";
import { PreviousEditionItem } from "@/types/cms";
import { initialPreviousEditions } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";

interface PreviousEditionsProps {
  initialData?: PreviousEditionItem[];
}

export default function PreviousEditions({
  initialData,
}: PreviousEditionsProps) {
  const { t } = useLanguage();
  const editions = initialData ?? initialPreviousEditions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );

  const total = editions.length;
  const activeVideo = editions[currentIndex] || editions[0];

  const triggerSlide = useCallback(
    (newIndex: number, direction: "left" | "right") => {
      setSlideDirection(direction);
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setSlideDirection(null);
      }, 220);
    },
    [],
  );

  // Oneindige loop naar vorige video
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + total) % total;
    triggerSlide(prevIndex, "left");
  };

  // Oneindige loop naar volgende video
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % total;
    triggerSlide(nextIndex, "right");
  };

  return (
    <section
      id="previous-editions"
      className="py-24 bg-zinc-900 text-white relative overflow-hidden"
    >
      {/* Sfeerverlichting achter de videospeler */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[720px] rounded-full bg-amber-500/10 blur-[140px]" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Titel & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
            <Film className="h-4 w-4 animate-pulse" />
            {t("Terugblik", "Looking Back")}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {t("Previous Editions", "Previous Editions")}
          </h2>
          <p className="text-zinc-400 mt-4 text-base md:text-lg">
            {t(
              "Herbeleef de hoogtepunten, finales en aftermovies van eerdere DBB edities.",
              "Relive the highlights, finals and aftermovies from previous DBB editions.",
            )}
          </p>
        </div>

        {/* Enkele YouTube Speler met Pijltjes Links en Rechts ernaast */}
        {activeVideo && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 md:gap-6">
              {/* Pijl Links (Desktop & Tablet naast video) */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrev}
                aria-label={t("Vorige video", "Previous video")}
                className="hidden sm:flex h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full border-zinc-700/80 bg-zinc-950/90 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:border-amber-500 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95"
              >
                <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
              </Button>

              {/* 16:9 YouTube Embed Container */}
              <div className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-black shadow-[0_0_50px_-12px_rgba(0,0,0,0.9)] overflow-hidden group transition-all duration-500 hover:border-amber-500/60 hover:shadow-[0_0_55px_-10px_rgba(245,158,11,0.28)]">
                <div
                  className={`h-full w-full transition-all duration-300 ease-out ${
                    slideDirection === "right"
                      ? "opacity-0 -translate-x-6 scale-[0.98]"
                      : slideDirection === "left"
                        ? "opacity-0 translate-x-6 scale-[0.98]"
                        : "opacity-100 translate-x-0 scale-100"
                  }`}
                >
                  <iframe
                    key={activeVideo.embedUrl}
                    src={activeVideo.embedUrl}
                    title={t(activeVideo.title || "", activeVideo.titleEn)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
              </div>

              {/* Pijl Rechts (Desktop & Tablet naast video) */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNext}
                aria-label={t("Volgende video", "Next video")}
                className="hidden sm:flex h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full border-zinc-700/80 bg-zinc-950/90 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:border-amber-500 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95"
              >
                <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
              </Button>
            </div>

            {/* Mobiele pijltjes + Video Informatie Balk */}
            <div className="mt-6 flex flex-col items-center text-center px-2">
              {/* Pijltjes op mobiel direct onder de video */}
              <div className="flex sm:hidden items-center gap-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  aria-label={t("Vorige video", "Previous video")}
                  className="h-11 w-11 rounded-full border-zinc-700 bg-zinc-950 text-white hover:border-amber-500 hover:bg-amber-500 hover:text-black"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  aria-label={t("Volgende video", "Next video")}
                  className="h-11 w-11 rounded-full border-zinc-700 bg-zinc-950 text-white hover:border-amber-500 hover:bg-amber-500 hover:text-black"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white transition-colors">
                {t(activeVideo.title || "", activeVideo.titleEn)}
              </h3>

              {activeVideo.description && (
                <p className="text-sm md:text-base text-zinc-400 max-w-2xl mt-2 leading-relaxed">
                  {t(activeVideo.description || "", activeVideo.descriptionEn)}
                </p>
              )}

              {/* Subtiele paginatie-stippen voor direct kiezen */}
              {total > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2.5">
                  {editions.map((item, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (idx === currentIndex) return;
                          triggerSlide(
                            idx,
                            idx > currentIndex ? "right" : "left",
                          );
                        }}
                        aria-label={`${t("Bekijk", "View")} ${t(item.title, item.titleEn)}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-8 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                            : "w-2.5 bg-zinc-700 hover:bg-zinc-500"
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
