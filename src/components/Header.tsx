"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

// Custom Instagram icon
function InstagramIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}
function YouTubeIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.9-.9-1.9-.9-2.4-1C16.9 2.5 12 2.5 12 2.5s-4.9 0-8.2.3c-.5.1-1.5.1-2.4 1C.7 4.5.5 6.2.5 6.2S.2 8.2.2 10.1v1.8c0 1.9.3 3.9.3 3.9s.2 1.7.9 2.4c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.9 0 8.2-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.4.9-2.4s.3-2 .3-3.9v-1.8c0-1.9-.3-3.9-.3-3.9ZM9.7 14.5v-7l6.3 3.5-6.3 3.5Z" />
        </svg>
    );
}
export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-black/90 backdrop-blur-lg border-b border-white/10"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-lg gradient-orange flex items-center justify-center shadow-lg group-hover:animate-pulse-glow transition-all overflow-hidden">
                            <Image
                                src="/logo-dbb2.png"
                                alt="DBB logo"
                                width={40}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-bold text-white text-lg tracking-wide">
                                DUTCH BEATBOX BATTLE
                            </p>
                            <p className="text-xs text-white/60 tracking-widest uppercase">
                                Nederlands Kampioenschap
                            </p>
                        </div>
                    </Link>

                    {/* Tagline - Desktop only */}
                    <div className="hidden lg:block flex-1 text-center">
                        <p className="text-white/80 text-sm italic">
                            
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="#about"
                            className="text-white/80 hover:text-[#FF6B00] transition-colors text-sm uppercase tracking-wider"
                        >
                            Over Ons
                        </Link>
                        <Link
                            href="#projects"
                            className="text-white/80 hover:text-[#FF6B00] transition-colors text-sm uppercase tracking-wider"
                        >
                            Projecten
                        </Link>
                        <Link
                            href="#road-to-dbb"
                            className="text-white/80 hover:text-[#FF6B00] transition-colors text-sm uppercase tracking-wider"
                        >
                            Road to DBB
                        </Link>
                        <Link
                            href="#contact"
                            className="text-white/80 hover:text-[#FF6B00] transition-colors text-sm uppercase tracking-wider"
                        >
                            Contact
                        </Link>
                        <div className="flex items-center gap-3 ml-2">
                            <a
                                href="https://www.youtube.com/c/DutchBeatboxBattle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-[#FF6B00] transition-colors"
                                aria-label="YouTube"
                            >
                                <YouTubeIcon size={20} />
                            </a>
                            <a
                                href="https://instagram.com/dutchbeatboxbattle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-[#FF6B00] transition-colors"
                                aria-label="Instagram"
                            >
                                <InstagramIcon size={18} />
                            </a>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 animate-fade-in-up">
                        <nav className="flex flex-col py-4">
                            <Link
                                href="#about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-white/80 hover:text-[#FF6B00] hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                            >
                                Over Ons
                            </Link>
                            <Link
                                href="#projects"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-white/80 hover:text-[#FF6B00] hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                            >
                                Projecten
                            </Link>
                            <Link
                                href="#road-to-dbb"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-white/80 hover:text-[#FF6B00] hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                            >
                                Road to DBB
                            </Link>
                            <Link
                                href="#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-white/80 hover:text-[#FF6B00] hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                            >
                                Contact
                            </Link>
                            <div className="flex items-center gap-4 px-6 py-3">
                                <a
                                    href="https://www.youtube.com/c/DutchBeatboxBattle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-[#FF6B00] transition-colors"
                                    aria-label="YouTube"
                                >
                                    <YouTubeIcon size={22} />
                                </a>
                                <a
                                    href="https://instagram.com/dutchbeatboxbattle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-[#FF6B00] transition-colors"
                                    aria-label="Instagram"
                                >
                                    <InstagramIcon size={20} />
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
