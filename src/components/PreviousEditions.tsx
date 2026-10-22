```tsx
"use client";


import React, { useState } from "react";
import { PreviousEditionItem } from "@/types/cms";
import { initialPreviousEditions } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Film } from "lucide-react";


interface PreviousEditionsProps {
  initialData?: PreviousEditionItem[];
}


export default function PreviousEditions({
  initialData,
}: PreviousEditionsProps) {
  const editions =
    initialData && initialData.length > 0
      ? initialData
      : initialPreviousEditions;


  const [activeVideo, setActiveVideo] = useState<PreviousEditionItem>(
    editions[0]
  );


  return (
    <section
      id="previous-editions"
      className="py-20 bg-zinc-900 text-white relative"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
            <Film className="h-4 w-4" />
            Terugblik
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight">
            Previous Editions
          </h2>
          <p className="text-zinc-400 mt-4 text-base md:text-lg">
            Herbeleef de hoogtepunten, finales en aftermovies van eerdere DBB
            edities.
          </p>
        </div>


        {/* Hoofd Video Speler */}
        {activeVideo && (
          <div className="mb-10">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
              <iframe
                key={activeVideo.embedUrl}
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeVideo.edition}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {activeVideo.title}
                </h3>
              </div>
              {activeVideo.description && (
                <p className="text-sm text-zinc-400 max-w-xl">
                  {activeVideo.description}
                </p>
              )}
            </div>
          </div>
        )}


        {/* Keuzelijst indien er meerdere video's zijn */}
        {editions.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editions.map((item) => {
              const isSelected = activeVideo?.id === item.id;
              return (
                <Card
                  key={item.id}
                  onClick={() => setActiveVideo(item)}
                  className={`cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 bg-zinc-950/90 ${
                    isSelected
                      ? "border-amber-500 ring-2 ring-amber-500/40"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    <img
                      src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform ${
                          isSelected
                            ? "bg-amber-500 text-black scale-110"
                            : "bg-black/70 text-white border border-white/20"
                        }`}
                      >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <span className="text-xs font-semibold text-amber-400">
                      {item.edition}
                    </span>
                    <h4 className="font-bold text-white mt-0.5 line-clamp-1">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```
