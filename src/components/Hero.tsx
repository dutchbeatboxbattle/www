"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a00] to-black">
                {/* Placeholder for background image */}
                <div className="absolute inset-0 bg-[url('/hero-placeholder.jpg')] bg-cover bg-center opacity-40" />

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
                        src="/logo-dbb.png"
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
                    Het officiële Nederlands Kampioenschap Human Beatbox
                </p>

                {/* Tagline */}
                <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
                    Van battles en jams tot academy en live sessions: DBB brengt de
                    Nederlandse beatboxcommunity samen en geeft nieuw talent een podium.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="xl"
                        className="group"
                        onClick={() =>
                            document.getElementById("road-to-dbb")?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span>Bekijk Events</span>
                        <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                    </Button>

                    <a
                        href="https://forms.gle/phh9i81W7fSdwfGU7"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="xl" variant="outline">
                            Doe Mee
                        </Button>
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="h-8 w-8 text-[#FF6B00]" />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
            <div className="absolute top-40 right-20 w-3 h-3 bg-[#FF6B00] rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        </section>
    );
}
