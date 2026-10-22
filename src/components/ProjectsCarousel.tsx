```tsx
"use client";


import React, { useState } from "react";
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
} from "lucide-react";


interface ProjectsCarouselProps {
  initialData?: ProjectItem[];
}


export default function ProjectsCarousel({
  initialData,
}: ProjectsCarouselProps) {
  const projects =
    initialData && initialData.length > 0 ? initialData : initialProjects;
  const [currentIndex, setCurrentIndex] = useState(0);


  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };


  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };


  const renderStatusBadge = (status: ProjectItem["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <Clock className="h-3.5 w-3.5" />
            Actief / Lopend
          </span>
        );
      case "finished":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Finished
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/30">
            <XCircle className="h-3.5 w-3.5" />
            Geannuleerd
          </span>
        );
    }
  };


  return (
    <section id="projects" className="py-20 bg-zinc-950 text-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-amber-500">
              Onze Initiatieven
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight">
              DBB Projecten
            </h2>
          </div>


          {projects.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full border-zinc-800 bg-zinc-900/80 text-white hover:bg-zinc-800"
                aria-label="Vorig project"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full border-zinc-800 bg-zinc-900/80 text-white hover:bg-zinc-800"
                aria-label="Volgend project"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>


        {/* Grid weergave op desktop + uitgelichte carrousel-focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const isHighlighted = index === currentIndex;
            const isCancelled = project.status === "cancelled";
            const isFinished = project.status === "finished";


            return (
              <Card
                key={project.id}
                onClick={() => setCurrentIndex(index)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer bg-zinc-900/90 ${
                  isHighlighted
                    ? "border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                    : "border-zinc-800 hover:border-zinc-700"
                } ${isCancelled ? "opacity-75 grayscale-[40%]" : ""}`}
              >
                {/* Afbeelding Container */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={project.image || "/projects/01.webp"}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />


                  {/* Status Badge linksboven */}
                  <div className="absolute top-3 left-3 z-20">
                    {renderStatusBadge(project.status)}
                  </div>


                  {/* Categorie rechtsboven */}
                  {project.category && (
                    <span className="absolute top-3 right-3 z-20 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-zinc-200 border border-white/10">
                      {project.category}
                    </span>
                  )}


                  {/* FINISHED PNG OVERLAY (indien status === 'finished') */}
                  {isFinished && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
                      <img
                        src="/img/finished.png"
                        alt="Finished"
                        className="max-h-36 w-auto object-contain drop-shadow-2xl transform -rotate-6"
                      />
                    </div>
                  )}


                  {/* GEANNULEERD OVERLAY (indien status === 'cancelled') */}
                  {isCancelled && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-950/40 backdrop-blur-[1px] pointer-events-none">
                      <span className="rounded-lg border-2 border-red-500 bg-black/80 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-red-500 -rotate-6 shadow-xl">
                        Geannuleerd
                      </span>
                    </div>
                  )}
                </div>


                {/* Content */}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-5 line-clamp-3">
                    {project.description}
                  </p>


                  {project.link && !isCancelled && (
                    <a
                      href={project.link}
                      target={project.link.startsWith("http") ? "_blank" : undefined}
                      rel={
                        project.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Meer informatie
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```
