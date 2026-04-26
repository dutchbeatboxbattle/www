"use client";

import Link from "next/link";
import Image from "next/image";
function InstagramIcon({ className }: { className?: string }) {
    return (
        <span className={`${className ?? ""} flex items-center justify-center font-bold`}>
            IG
        </span>
    );
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <span className={`${className ?? ""} flex items-center justify-center font-bold`}>
            f
        </span>
    );
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}
function YouTubeIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.9-.9-1.9-.9-2.4-1C16.9 2.5 12 2.5 12 2.5s-4.9 0-8.2.3c-.5.1-1.5.1-2.4 1C.7 4.5.5 6.2.5 6.2S.2 8.2.2 10.1v1.8c0 1.9.3 3.9.3 3.9s.2 1.7.9 2.4c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.9 0 8.2-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.4.9-2.4s.3-2 .3-3.9v-1.8c0-1.9-.3-3.9-.3-3.9ZM9.7 14.5v-7l6.3 3.5-6.3 3.5Z" />
        </svg>
    );
}

const socialLinks = [
    {
        name: "Instagram",
        href: "https://instagram.com/dutchbeatboxbattle",
        icon: InstagramIcon,
        handle: "@dutchbeatboxbattle",
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com/c/DutchBeatboxBattle",
        icon: YouTubeIcon,
        handle: "Dutch Beatbox Battle",
    },
    {
        name: "TikTok",
        href: "https://tiktok.com/@dutchbeatboxbattle",
        icon: TikTokIcon,
        handle: "@dutchbeatboxbattle",
    },
    {
        name: "Facebook",
        href: "https://facebook.com/dutchbeatboxbattle",
        icon: FacebookIcon,
        handle: "@dutchbeatboxbattle",
    },
];

const footerLinks = [
    { name: "Over Ons", href: "#about" },
    { name: "Projecten", href: "#projects" },
    { name: "Road to DBB", href: "#road-to-dbb" },
    { name: "Contact", href: "#contact" },
];

export default function Footer() {
    return (
        <footer className="relative bg-black border-t border-white/10">
            {/* Orange accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 gradient-orange" />

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
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
                            <div>
                                <p className="font-bold text-white text-lg tracking-wide">
                                    DUTCH BEATBOX BATTLE
                                </p>
                                <p className="text-xs text-white/60 tracking-widest uppercase">
                                    Nederlands Kampioenschap
                                </p>
                            </div>
                        </Link>
                        <p className="text-white/60 max-w-md leading-relaxed mb-6">
                            Dutch Beatbox Battle is het officiële Nederlands Kampioenschap Human
                            Beatbox en het platform voor de Nederlandse beatboxcommunity.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:text-white transition-all duration-300 group"
                                    title={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
                            Navigatie
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#FF6B00] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            
                            {socialLinks.map((social) => (
                                <li key={social.name}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-[#FF6B00] transition-colors flex items-center gap-2"
                                    >
                                        <social.icon className="w-4 h-4" />
                                        <span>{social.handle}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Dutch Beatbox Battle. Izhia Arts. Juiced Unicorn. Alle rechten voorbehouden.
                    </p>
                    <p className="text-white/40 text-sm">
                        Nederlands Kampioenschap Human Beatbox
                    </p>
                </div>
            </div>
        </footer>
    );
}
