import { Sparkles } from "lucide-react";

/**
 * Shared page hero banner for inner pages in City Harvest AG design aesthetic.
 */
const PageHero = ({ badge, badgeIcon, title, subtitle }) => {
    const BadgeIcon = badgeIcon || Sparkles;

    return (
        <section className="relative pt-32 pb-20 md:py-28 bg-[#0B1B3D] text-white overflow-hidden border-b border-slate-800">
            {/* Ambient vector highlights */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                {badge && (
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-sky-950/60 border border-sky-500/30 rounded-full">
                        <BadgeIcon className="w-4 h-4 text-sky-400" />
                        <span className="text-xs uppercase tracking-widest font-bold text-sky-300">
                            {badge}
                        </span>
                    </div>
                )}

                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-white">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHero;
