"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { projects, type Project } from "@/data/projects";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="relative h-full overflow-hidden card-hover group">
      {/* Image area */}
      {/* Image area */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-black">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/20 to-transparent" />

          {/* Orange accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 gradient-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>

      {/* Finished overlay */}
      {project.isFinished && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {/* Placeholder overlay - user can replace with custom image */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          #<img
          #  src="/img/finished.png"
          #  alt="Afgelopen"
          #  className="relative z-10 w-48 md:w-64 transform -rotate-12"
          #/>
          <div className="relative z-10 transform -rotate-12">
            <div className="bg-[#FF6B00] px-8 py-3 rounded-lg shadow-xl">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-widest">
                AFGELOPEN
              </span>
            </div>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl text-white group-hover:text-[#FF6B00] transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          {project.description}
        </p>
      </CardContent>

      <CardFooter>
        {project.buttonText && project.buttonLink && !project.isFinished && (
          <a
            href={project.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {project.buttonText}
          </a>
        )}
        {project.isFinished && (
          <Button variant="ghost" size="sm" className="w-full opacity-50 cursor-not-allowed" disabled>
            Event Afgelopen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function ProjectsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-transparent via-[#0a0a0a] to-transparent">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00] rounded-full blur-[300px] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            ONZE <span className="text-gradient-orange">PROJECTEN</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Naast het NK realiseren wij nog andere projecten. Ontdek hieronder onze beatbox evenementen, battles en community projecten.
          </p>
          <div className="w-24 h-1 gradient-orange mx-auto rounded-full mt-6" />
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-[#FF6B00] text-white flex items-center justify-center hover:bg-[#FF8533] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
            disabled={!canScrollPrev}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-[#FF6B00] text-white flex items-center justify-center hover:bg-[#FF8533] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
            disabled={!canScrollNext}
          >
            <ChevronRight size={24} />
          </button>

          {/* Embla carousel */}
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile navigation dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            <button
              type="button"
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#FF6B00] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#FF6B00] transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
