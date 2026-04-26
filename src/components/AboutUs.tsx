"use client";

export default function AboutUs() {
    return (
        <section id="about" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full blur-[200px] opacity-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B00] rounded-full blur-[200px] opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        OVER <span className="text-gradient-orange">ONS</span>
                    </h2>
                    <div className="w-24 h-1 gradient-orange mx-auto rounded-full" />
                </div>

                {/* Content Grid */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Paragraph 1 */}
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                        <div className="absolute -left-4 top-8 w-8 h-1 gradient-orange rounded-full" />
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                            <span className="text-[#FF6B00] font-bold">Dutch Beatbox Battle</span>,
                            oftewel DBB, is het officiële Nederlands Kampioenschap Human Beatbox.
                            Wat begon als battleplatform is uitgegroeid tot een centraal punt voor
                            de Nederlandse beatboxscene. DBB organiseert kampioenschappen, jams,
                            educatieve trajecten en live performanceformats waarin beatboxers hun
                            techniek, muzikaliteit en eigen sound kunnen ontwikkelen.
                        </p>
                    </div>

                    {/* Paragraph 2 */}
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                        <div className="absolute -right-4 top-8 w-8 h-1 gradient-orange rounded-full" />
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                            Human beatbox is een volwaardige vocale muziekdiscipline. Een beatboxer
                            gebruikt stem, mond, lippen, keel, ademhaling en lichaam om ritmes,
                            baslijnen, melodieën, sound effects en complete muzikale composities
                            te maken. Bij DBB draait alles om deze unieke kunstvorm: van de intense
                            battles waarbij de beste beatboxers van Nederland het tegen elkaar opnemen,
                            tot laagdrempelige jams waar nieuwe talenten hun eerste stappen zetten.
                        </p>
                    </div>

                    {/* Paragraph 3 */}
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                        <div className="absolute -left-4 top-8 w-8 h-1 gradient-orange rounded-full" />
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                            Het platform verbindt beginners, kampioenen, publiek, makers en
                            internationale sceneleden, met één doel: human beatbox in Nederland
                            zichtbaar maken, versterken en doorgeven. Via Dutch Beatbox Academy
                            kunnen nieuwe en gevorderde beatboxers hun skills ontwikkelen, terwijl
                            DBB Sessions beatboxers een platform biedt om hun eigen sound te laten
                            horen buiten het battleformat. Samen bouwen we aan de toekomst van
                            human beatbox in Nederland.
                        </p>
                    </div>
                </div>

                {/* Stats or highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                    <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-3xl md:text-4xl font-bold text-[#FF6B00] mb-2">2005</div>
                        <div className="text-sm text-white/60 uppercase tracking-wider">Sinds</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-3xl md:text-4xl font-bold text-[#FF6B00] mb-2">NL</div>
                        <div className="text-sm text-white/60 uppercase tracking-wider">Kampioenschap</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-3xl md:text-4xl font-bold text-[#FF6B00] mb-2">20+</div>
                        <div className="text-sm text-white/60 uppercase tracking-wider">Evenementen</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-3xl md:text-4xl font-bold text-[#FF6B00] mb-2">20+</div>
                        <div className="text-sm text-white/60 uppercase tracking-wider">Kampioenen</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
