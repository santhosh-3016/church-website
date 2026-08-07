import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AlternatingSection = ({
    title,
    subtitle,
    description,
    image,
    imageAlt,
    linkText,
    linkPath,
    badge,
    isReversed = false,
}) => {
    const [imgRef, imgVisible] = useScrollReveal();
    const [textRef, textVisible] = useScrollReveal();

    return (
        <section className={`py-16 md:py-24 overflow-hidden ${isReversed ? "bg-slate-50 border-y border-slate-200/60" : "bg-white"}`}>
            <div className="container mx-auto px-4 md:px-6">
                <div className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-16 items-center`}>

                    {/* Image */}
                    <div
                        ref={imgRef}
                        className={`w-full lg:w-1/2 reveal ${isReversed ? "from-right" : "from-left"} ${imgVisible ? "visible" : ""}`}
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
                            <img
                                src={image}
                                alt={imageAlt || title}
                                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>
                    </div>

                    {/* Text */}
                    <div
                        ref={textRef}
                        className={`w-full lg:w-1/2 space-y-5 reveal ${isReversed ? "from-left" : "from-right"} ${textVisible ? "visible" : ""}`}
                        style={{ transitionDelay: "150ms" }}
                    >
                        {badge && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-100">
                                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">{badge}</span>
                            </div>
                        )}

                        {subtitle && (
                            <p className="text-sky-600 font-bold uppercase tracking-wider text-xs">
                                {subtitle}
                            </p>
                        )}

                        <h2 className="text-3xl md:text-4xl font-extrabold font-heading leading-tight text-[#0B1B3D]">
                            {title}
                        </h2>

                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            {description}
                        </p>

                        {linkText && linkPath && (
                            <div className="pt-2">
                                <Link
                                    to={linkPath}
                                    className="inline-flex items-center px-6 py-3 rounded-full bg-[#0B1B3D] text-white text-sm font-bold hover:bg-sky-700 transition-colors shadow-sm"
                                >
                                    <span>{linkText}</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AlternatingSection;
