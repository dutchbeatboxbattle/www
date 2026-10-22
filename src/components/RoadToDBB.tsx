```tsx
"use client";


import React from "react";
import { RoadMilestoneItem } from "@/types/cms";
import { initialRoadToDbb } from "@/data/projects";
import {
  Flag,
  Trophy,
  Rocket,
  Users,
  Star,
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  CircleDot,
} from "lucide-react";


interface RoadToDBBProps {
  initialData?: RoadMilestoneItem[];
}


export default function RoadToDBB({ initialData }: RoadToDBBProps) {
  const milestones = (
    initialData && initialData.length > 0 ? initialData : initialRoadToDbb
  )
    .slice()
    .sort((a, b) => a.order - b.order);


  const renderIcon = (icon: RoadMilestoneItem["icon"]) => {
    const props = { className: "h-5 w-5" };
    switch (icon) {
      case "flag":
        return <Flag {...props} />;
      case "trophy":
        return <Trophy {...props} />;
      case "rocket":
        return <Rocket {...props} />;
      case "users":
        return <Users {...props} />;
      case "star":
        return <Star {...props} />;
      case "zap":
        return <Zap {...props} />;
      case "calendar":
      default:
        return <Calendar {...props} />;
    }
  };


  const renderStatusPill = (status: RoadMilestoneItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Voltooid
          </span>
        );
      case "current":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/40 animate-pulse">
            <CircleDot className="h-3 w-3" />
            Huidige Fase
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-700">
            <Clock className="h-3 w-3" />
            Binnenkort
          </span>
        );
    }
  };


  return (
    <section id="road-to-dbb" className="py-20 bg-zinc-950 text-white relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-amber-500">
            Tijdlijn & Stappenplan
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight">
            Road to DBB
          </h2>
          <p className="text-zinc-400 mt-4">
            Volg elke mijlpaal op weg naar het volgende grote DBB-evenement.
          </p>
        </div>


        <div className="relative">
          {/* Verticale lijn */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-500 via-zinc-700 to-zinc-900" />


          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isCurrent = milestone.status === "current";
              const isCompleted = milestone.status === "completed";


              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Tijdlijn Icoon Node */}
                  <div
                    className={`absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg transition-all ${
                      isCurrent
                        ? "bg-amber-500 text-black border-amber-300 shadow-amber-500/30 scale-110"
                        : isCompleted
                        ? "bg-zinc-900 text-emerald-400 border-emerald-500/60"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {renderIcon(milestone.icon)}
                  </div>


                  {/* Kaart */}
                  <div
                    className={`w-full pl-16 md:pl-0 md:w-1/2 ${
                      isEven ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div
                      className={`rounded-2xl border p-6 bg-zinc-900/90 transition-all ${
                        isCurrent
                          ? "border-amber-500/70 shadow-lg shadow-amber-500/10"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          #{index + 1} • {milestone.dateOrPeriod}
                        </span>
                        {renderStatusPill(milestone.status)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```
