"use client";
import { useLanguage } from "@/lib/LanguageContext";

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
  const { t } = useLanguage();
  const milestones = (initialData ?? initialRoadToDbb)
    .slice()
    .sort((a, b) => a.order - b.order);

  const renderIcon = (icon: RoadMilestoneItem["icon"]) => {
    const props = {
      className:
        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
    };
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("Voltooid", "Completed")}
          </span>
        );
      case "current":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
            <CircleDot className="h-3.5 w-3.5" />
            {t("Huidige Fase", "Current Phase")}
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-700">
            <Clock className="h-3.5 w-3.5" />
            {t("Binnenkort", "Coming Soon")}
          </span>
        );
    }
  };

  return (
    <section
      id="road-to-dbb"
      className="py-24 bg-zinc-950 text-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-amber-500">
            {t("Tijdlijn & Stappenplan", "Timeline & Roadmap")}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Road to DBB
          </h2>
          <p className="text-zinc-400 mt-4">
            {t(
              "Volg elke mijlpaal op weg naar het volgende grote DBB-evenement.",
              "Follow every milestone on the road to the next major DBB event.",
            )}
          </p>
        </div>

        <div className="relative">
          {/* Verticale gloeiende tijdlijn */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-500 via-amber-500/40 to-zinc-800" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isCurrent = milestone.status === "current";
              const isCompleted = milestone.status === "completed";

              return (
                <div
                  key={milestone.id}
                  className={`group relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Tijdlijn Icoon Node */}
                  <div
                    className={`absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 group-hover:scale-110 ${
                      isCurrent
                        ? "bg-amber-500 text-black border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.7)] scale-110"
                        : isCompleted
                          ? "bg-zinc-900 text-emerald-400 border-emerald-500/60 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                          : "bg-zinc-900 text-zinc-400 border-zinc-700 group-hover:border-amber-500/60 group-hover:text-amber-300"
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
                      className={`rounded-2xl border p-6 bg-zinc-900/90 transition-all duration-300 group-hover:-translate-y-1.5 ${
                        isCurrent
                          ? "border-amber-500/70 shadow-[0_10px_35px_-10px_rgba(245,158,11,0.25)]"
                          : "border-zinc-800 group-hover:border-amber-500/50 group-hover:shadow-[0_10px_30px_-12px_rgba(245,158,11,0.18)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          #{index + 1} •{" "}
                          {t(
                            milestone.dateOrPeriod || "",
                            milestone.dateOrPeriodEn,
                          )}
                        </span>
                        {renderStatusPill(milestone.status)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-amber-400">
                        {t(milestone.title || "", milestone.titleEn)}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {t(
                          milestone.description || "",
                          milestone.descriptionEn,
                        )}
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
