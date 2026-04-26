"use client";

import { Button } from "@/components/ui/button";
import { Mail, Mic2, Users, GraduationCap, ArrowRight } from "lucide-react";

const services = [
    {
        icon: Mic2,
        title: "Book a Beatboxer",
        description: "Boek een professionele beatboxer voor je evenement, festival of corporate event.",
    },
    {
        icon: Users,
        title: "Programmering",
        description: "Laat DBB een beatbox event programmeren op je festival of locatie.",
    },
    {
        icon: GraduationCap,
        title: "Workshops",
        description: "Interactieve beatbox workshops voor scholen, bedrijven en community events.",
    },
];

export default function Contact() {
    return (
        <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0808] to-[#0a0a0a]" />

            {/* Orange glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF6B00] rounded-full blur-[200px] opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        CONTACT & <span className="text-gradient-orange">BOOKINGS</span>
                    </h2>
                    <div className="w-24 h-1 gradient-orange mx-auto rounded-full mb-8" />
                    <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
                        Wil je een beatboxer boeken voor je event? Interesse in een workshop of
                        programmering op je festival? Neem contact met ons op en ontdek de
                        mogelijkheden.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    {services.map((service) => (
                        <a
                            key={service.title}
                            href={`mailto:info@dutchbeatboxbattle.nl?subject=${encodeURIComponent(service.title)}`}
                            className="block p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:border-[#FF6B00]/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                            aria-label={`Mail Dutch Beatbox Battle over ${service.title}`}
                        >
                            <div className="w-14 h-14 rounded-xl gradient-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <service.icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">
                                {service.title}
                            </h3>

                            <p className="text-white/60 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00] group-hover:text-[#FF8533] transition-colors">
                                <span>Mail ons</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Contact Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden">
                        {/* Background gradient */}
                        <div className="absolute inset-0 gradient-orange opacity-10" />
                        <div className="absolute inset-0 border-2 border-[#FF6B00] rounded-2xl" />

                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 rounded-full bg-[#FF6B00] flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                                <Mail className="w-10 h-10 text-white" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Neem Contact Op
                            </h3>

                            <p className="text-white/70 mb-8 max-w-lg mx-auto">
                                Voor boekingen, samenwerkingen, pers of andere vragen kun je ons
                                bereiken via e-mail. We reageren zo snel mogelijk.
                            </p>

                            <a
                                href="mailto:info@dutchbeatboxbattle.nl"
                                className="inline-flex items-center gap-3 text-xl md:text-2xl font-bold text-[#FF6B00] hover:text-[#FF8533] transition-colors group"
                            >
                                <span>info@dutchbeatboxbattle.nl</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </a>

                            <div className="mt-8">
                                <Button
                                    size="lg"
                                    onClick={() => window.location.href = "mailto:info@dutchbeatboxbattle.nl"}
                                >
                                    <Mail className="mr-2 h-5 w-5" />
                                    Stuur een E-mail
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
