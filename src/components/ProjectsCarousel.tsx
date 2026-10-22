"use client";
import { sitePath, isSafeLink } from "@/lib/site-path";
import { useLanguage } from "@/lib/LanguageContext";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ProjectItem } from "@/types/cms";
import { initialProjects } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";

interface ProjectsCarouselProps {
  initialData?: ProjectItem[];
}

export default function ProjectsCarousel({
  initialData,
}: ProjectsCarouselProps) {
  const { t } = useLanguage();
  const rawProjects = initialData ?? initialProjects;

  const drag = useRef<{ id: number; x: number; y: number; dx: number; horizontal: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(rawProjects.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Pas het aantal zichtbare kaarten naast elkaar aan op schermbreedte (max 3)
  useEffect(() => {
    const updateResponsiveView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    updateResponsiveView();
    window.addEventListener("resize", updateResponsiveView);
    return () => window.removeEventListener("resize", updateResponsiveView);
  }, []);

  // Zorg dat er altijd genoeg items zijn om naadloos oneindig te loopen
  const baseList =
    rawProjects.length < 3
      ? [...rawProjects, ...rawProjects, ...rawProjects]
      : rawProjects;

  const total = baseList.length;
  // Drievoudige lijst [kopie-voor, origineel, kopie-achter] voor een naadloze oneindige loop
  const extendedProjects = [...baseList, ...baseList, ...baseList];

  useEffect(() => {
    setIsTransitioning(false);
    setCurrentIndex(total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (isAnimating || rawProjects.length < 2) return;
    setIsAnimating(true);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating, rawProjects.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || rawProjects.length < 2) return;
    setIsAnimating(true);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating, rawProjects.length]);

  // Na het afronden van de schuif-animatie: spring onzichtbaar terug naar de middelste set
  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (currentIndex >= total * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - total);
    } else if (currentIndex < total) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + total);
    }
  };

  // Fallback timer voor het geval transitionEnd niet vuurt (bijv. bij tabwissel)
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (currentIndex >= total * 2) {
        setIsTransitioning(false);
        setCurrentIndex((prev) => prev - total);
      } else if (currentIndex < total) {
        setIsTransitioning(false);
        setCurrentIndex((prev) => prev + total);
      }
    }, 550);
    return () => clearTimeout(timer);
  }, [isAnimating, currentIndex, total]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    suppressClick.current = false;
    if (!event.isPrimary || event.button !== 0 || isAnimating || rawProjects.length < 2) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, horizontal: false };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
      gesture.horizontal = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    gesture.dx = dx;
    const limit = event.currentTarget.clientWidth / itemsPerView;
    setDragOffset(Math.max(-limit, Math.min(limit, dx)));
  };
  const finishDrag = (event: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    setDragOffset(0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!cancelled && gesture.horizontal && Math.abs(gesture.dx) >= 40) {
      if (gesture.dx < 0) handleNext(); else handlePrev();
    }
  };

  const activeDotIndex = rawProjects.length ? ((currentIndex % rawProjects.length) + rawProjects.length) % rawProjects.length : 0;

  const renderStatusBadge = (status: ProjectItem["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <Clock className="h-3.5 w-3.5" />
            {t("Actief / Lopend", "Active / Ongoing")}
          </span>
        );
      case "finished":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("Finished", "Finished")}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/40 backdrop-blur-md">
            <XCircle className="h-3.5 w-3.5" />
            {t("Geannuleerd", "Cancelled")}
          </span>
        );
    }
  };

  const translatePercentage = currentIndex * (100 / itemsPerView);

  return (
    <section
      id="projects"
      className="py-24 bg-zinc-950 text-white relative overflow-hidden"
    >
      {/* Subtiele sfeergloed op de achtergrond */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-amber-600/10 blur-[120px]" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Sectie Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
              <Sparkles className="h-4 w-4 animate-spin [animation-duration:6s]" />
              {t("Onze Initiatieven", "Our Initiatives")}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {t("DBB Projecten", "DBB Projects")}
            </h2>
          </div>

          {/* Navigatieknoppen rechtsboven */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={rawProjects.length < 2}
              className="h-11 w-11 rounded-full border-zinc-800 bg-zinc-900/90 text-white transition-all duration-300 hover:scale-110 hover:border-amber-500 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95"
              aria-label={t("Vorig project", "Previous project")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={rawProjects.length < 2}
              className="h-11 w-11 rounded-full border-zinc-800 bg-zinc-900/90 text-white transition-all duration-300 hover:scale-110 hover:border-amber-500 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95"
              aria-label={t("Volgend project", "Next project")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carrousel met muis- en touchbediening */}
        <div className="relative group/carousel">
          {/* 1-Rij Viewport */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t("Projecten — sleep of gebruik de pijltjestoetsen", "Projects — drag or use the arrow keys")}
            tabIndex={0}
            className={`overflow-hidden py-4 -my-4 px-1 -mx-1 select-none touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={event => finishDrag(event)}
            onPointerCancel={event => finishDrag(event, true)}
            onLostPointerCapture={event => { if (event.target === event.currentTarget) finishDrag(event, true); }}
            onDragStart={event => event.preventDefault()}
            onClickCapture={event => { if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); } }}
            onKeyDown={event => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "ArrowLeft") { event.preventDefault(); handlePrev(); }
              if (event.key === "ArrowRight") { event.preventDefault(); handleNext(); }
            }}
          >
            <div
              onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "transform") handleTransitionEnd(); }}
              className={`flex ${
                isTransitioning && !dragging
                  ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  : ""
              }`}
              style={{
                transform: `translate3d(calc(-${translatePercentage}% + ${dragOffset}px), 0, 0)`,
              }}
            >
              {extendedProjects.map((project, idx) => {
                const isCancelled = project.status === "cancelled";
                const isFinished = project.status === "finished";

                return (
                  <div
                    key={`${project.id}-${idx}`}
                    style={{ width: `${100 / itemsPerView}%` }}
                    className="shrink-0 px-3"
                  >
                    <Card
                      className={`group relative h-full flex flex-col overflow-hidden rounded-2xl border bg-zinc-900/90 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/70 hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.28)] border-zinc-800/90 ${
                        isCancelled ? "opacity-75 grayscale-[35%]" : ""
                      }`}
                    >
                      {/* Subtiele lichtglans bij hover */}
                      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-amber-500/0 via-amber-400/0 to-amber-500/0 opacity-0 transition-opacity duration-500 group-hover:from-amber-500/5 group-hover:via-transparent group-hover:to-amber-400/10 group-hover:opacity-100" />

                      {/* Afbeelding Container */}
                      <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                        <img
                          draggable={false}
                          src={sitePath(project.image || "/projects/01.webp")}
                          alt={t(project.title || "", project.titleEn)}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                        {/* Status Badge linksboven */}
                        <div className="absolute top-3 left-3 z-20 transition-transform duration-300 group-hover:scale-105">
                          {renderStatusBadge(project.status)}
                        </div>

                        {/* Categorie rechtsboven */}
                        {project.category && (
                          <span className="absolute top-3 right-3 z-20 rounded-md bg-black/65 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-zinc-200 border border-white/10 transition-colors duration-300 group-hover:border-amber-500/40 group-hover:text-amber-300">
                            {t(project.category || "", project.categoryEn)}
                          </span>
                        )}

                        {/* FINISHED OVERLAY */}
                        {isFinished && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-yellow-950/40 backdrop-blur-[1px] pointer-events-none">
                            <span className="rounded-lg border-2 border-yellow-400 bg-black/80 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-yellow-400 -rotate-6 shadow-xl">
                              Finished
                            </span>
                          </div>
                        )}

                        {/* GEANNULEERD OVERLAY */}
                        {isCancelled && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-950/40 backdrop-blur-[1px] pointer-events-none">
                            <span className="rounded-lg border-2 border-red-500 bg-black/80 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-red-500 -rotate-6 shadow-xl">
                              {t("Geannuleerd", "Cancelled")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tekst & Actie */}
                      <CardContent className="p-6 flex flex-col flex-1 justify-between relative z-20">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-amber-400">
                            {t(project.title || "", project.titleEn)}
                          </h3>
                          <p className="text-sm text-zinc-400 leading-relaxed mb-5 line-clamp-3">
                            {t(
                              project.description || "",
                              project.descriptionEn,
                            )}
                          </p>
                        </div>

                        {project.link &&
                          isSafeLink(project.link) &&
                          !isCancelled && (
                            <a
                              href={sitePath(project.link)}
                              target={
                                project.link.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                project.link.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-all duration-300 group/link w-fit"
                            >
                              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-amber-400 after:transition-all after:duration-300 group-hover/link:after:w-full">
                                {t("Meer informatie", "More information")}
                              </span>
                              <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5" />
                            </a>
                          )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Paginatie Indicatoren onderaan */}
        <div className="mt-10 flex items-center justify-center gap-2.5">
          {rawProjects.map((item, index) => {
            const isActive = index === activeDotIndex;
            return (
              <button
                key={item.id + index}
                type="button"
                onClick={() => {
                  if (isAnimating || rawProjects.length < 2) return;
                  setIsTransitioning(true);
                  setCurrentIndex(total + index);
                }}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${t("Ga naar project", "Go to project")} ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                    : "w-2.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
