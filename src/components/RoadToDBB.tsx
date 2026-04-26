"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface Event {
    id: string;
    title: string;
    location: string;
    date: string;
    link?: string;
    isTBA: boolean;
}

const events: Event[] = [
    {
        id: "qualifier-1",
        title: "QUALIFIER ROUND #1",
        location: "Urban Matterz Festival",
        date: "20 september 2026",
        link: "https://urbanmatterz.nl",
        isTBA: false,
    },
    {
        id: "qualifier-2",
        title: "QUALIFIER ROUND #2",
        location: "TBA",
        date: "TBA",
        link: "#",
        isTBA: true,
    },
    {
        id: "finals",
        title: "DUTCH BEATBOX BATTLE 2026",
        location: "TBA",
        date: "TBA",
        link: "#",
        isTBA: true,
    },
];

export default function RoadToDBB() {
    return (
        <section id="road-to-dbb" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0808] to-[#0a0a0a]" />

            {/* Orange accent lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        ROAD TO <span className="text-gradient-orange">DBB</span>
                    </h2>
                    <div className="w-24 h-1 gradient-orange mx-auto rounded-full mb-8" />
                    <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
                        Het Nederlands Kampioenschap Human Beatbox 2026 gaat van start met een paar
                        spannende voorrondes. Strijd je een weg naar de finale en claim je plek in
                        de Nederlandse beatboxgeschiedenis.
                    </p>
                </div>

                {/* Events Timeline */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B00] via-[#FF6B00]/50 to-transparent" />

                        {/* Events */}
                        <div className="space-y-12">
                            {events.map((event, index) => (
                                <div
                                    key={event.id}
                                    className={`relative flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                        }`}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                                        <div
                                            className={`w-6 h-6 rounded-full border-4 ${event.isTBA
                                                    ? "border-white/30 bg-[#0a0a0a]"
                                                    : "border-[#FF6B00] bg-[#FF6B00] animate-pulse-glow"
                                                }`}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div
                                        className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                                            }`}
                                    >
                                        <div
                                            className={`p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:border-[#FF6B00]/50 transition-colors ${event.isTBA ? "opacity-70" : ""
                                                }`}
                                        >
                                            {/* Event number badge */}
                                            <div
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 ${event.isTBA
                                                        ? "bg-white/10 text-white/50"
                                                        : "gradient-orange text-white"
                                                    }`}
                                            >
                                                {index === events.length - 1 ? "FINALE" : `RONDE ${index + 1}`}
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                                                {event.title}
                                            </h3>

                                            <div className={`flex flex-col gap-2 ${index % 2 === 0 ? "md:items-end" : "md:items-start"}`}>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <MapPin size={16} className="text-[#FF6B00]" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Calendar size={16} className="text-[#FF6B00]" />
                                                    <span>{event.date}</span>
                                                </div>
                                            </div>

                                            {!event.isTBA && event.link && (
                                                <Button
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={() => {
                                                        if (event.link) {
                                                            window.open(event.link, "_blank", "noopener,noreferrer");
                                                        }
                                                    }}
                                                >
                                                    <span>Bekijk Event</span>
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Spacer for alternating layout on desktop */}
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-white/60 mb-6">
                        Blijf op de hoogte van alle aankondigingen en schrijf je in voor de voorrondes.
                    </p>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() =>
                            window.open(
                                "https://forms.gle/phh9i81W7fSdwfGU7",
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Schrijf Je In
                    </Button>
                </div>
            </div>
        </section>
    );
}
