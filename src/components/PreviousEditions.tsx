"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface VideoItem {
    id: string;
    title: string;
    year: string;
    youtubeId: string; // YouTube video ID for embedding
}


const videos: VideoItem[] = [
    {
        id: "dbb-2024",
        title: "Dutch Beatbox Battle 2022",
        year: "2022",
        youtubeId: "H86igki9SL4", 
    },
    {
        id: "dbb-2023",
        title: "Dutch Beatbox Battle 2021",
        year: "2021",
        youtubeId: "JirOAPzrdA4", 
    },
    {
        id: "dbb-2022",
        title: "Loop-Di-Loop 2025",
        year: "2025",
        youtubeId: "3jIYPgJ_j08", 
    },
    {
        id: "dbb-2019",
        title: "Dutch Beatbox Battle 2023: Tag Team finals",
        year: "2023",
        youtubeId: "OX6_vjFXEM0", 
    },
];

export default function PreviousEditions() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "center",
        loop: true,
        skipSnaps: false,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setActiveVideo(null); // Reset active video when scrolling
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section id="previous-editions" className="py-24 md:py-32 relative overflow-hidden bg-black">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6B00] rounded-full blur-[300px] opacity-5" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        PREVIOUS <span className="text-gradient-orange">EDITIONS</span>
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Herleef de beste momenten van eerdere edities van Dutch Beatbox Battle
                    </p>
                    <div className="w-24 h-1 gradient-orange mx-auto rounded-full mt-6" />
                </div>

                {/* Video Carousel */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Navigation buttons */}
                    <button
                        type="button"
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        type="button"
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Embla carousel */}
                    <div className="embla overflow-hidden rounded-2xl" ref={emblaRef}>
                        <div className="embla__container flex">
                            {videos.map((video, index) => (
                                <div
                                    key={video.id}
                                    className="embla__slide flex-[0_0_100%] md:flex-[0_0_80%] min-w-0 px-2 md:px-4"
                                >
                                    <div
                                        className={`relative aspect-video rounded-2xl overflow-hidden transition-all duration-500 ${selectedIndex === index
                                                ? "scale-100 opacity-100"
                                                : "scale-95 opacity-50"
                                            }`}
                                    >
                                        {/* Video embed or placeholder */}
                                        {activeVideo === video.id ? (
                                            <iframe
                                                className="absolute inset-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                                                title={video.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <>
                                                {/* Thumbnail placeholder */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/30 to-[#1a1a1a] flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-6xl md:text-8xl font-bold text-white/20 mb-2">
                                                            {video.year}
                                                        </div>
                                                        <span className="text-sm text-white/40 uppercase tracking-wider">
                                                            After Movie
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Play button overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveVideo(video.id)}
                                                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                                                >
                                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FF6B00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl animate-pulse-glow">
                                                        <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                                                    </div>
                                                </button>

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />

                                                {/* Title */}
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <h3 className="text-xl md:text-2xl font-bold text-white">
                                                        {video.title}
                                                    </h3>
                                                </div>
                                            </>
                                        )}

                                        {/* Border glow effect */}
                                        {selectedIndex === index && (
                                            <div className="absolute inset-0 rounded-2xl border-2 border-[#FF6B00]/50 pointer-events-none" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {videos.map((video, index) => (
                            <button
                                type="button"
                                key={video.id}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === index
                                        ? "w-8 bg-[#FF6B00]"
                                        : "bg-white/30 hover:bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
