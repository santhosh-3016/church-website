import { Play, ArrowRight, Calendar, Heart, Users, Flame, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative pt-12 md:pt-16 pb-0 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#EEF5FF] overflow-hidden">
            {/* Background Vector Orbs / City Harvest Style */}
            <div className="absolute top-10 right-5 md:right-1/4 w-[500px] h-[500px] bg-sky-100/60 rounded-full blur-3xl -z-0 pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-2xl -z-0 pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 pb-8 md:pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

                    {/* Left Column: Bold Typography & Tagline */}
                    <div
                        className="lg:col-span-6 space-y-6 text-left transition-all duration-700 ease-out"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(25px)",
                        }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-100/80 text-sky-600 text-xs md:text-sm font-semibold tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-sky-500 fill-sky-200" />
                            <span className="uppercase">WELCOME TO</span>
                        </div>

                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-[#0B1B3D] tracking-tight leading-[1.15]">
                            Power of Praise <br />
                            <span className="text-sky-600">A.G. Church</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-xl">
                            "As in the days when you came out of Egypt, I will show My wonders."
                            <span className="block mt-1 text-sm font-semibold text-sky-700">— Micah 7:15</span>
                        </p>

                        <div className="pt-2 flex flex-wrap gap-4 items-center">
                            <Button
                                size="lg"
                                asChild
                                className="rounded-full px-7 bg-[#0B1B3D] hover:bg-sky-900 text-white font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                <Link to="/sermons" className="flex items-center gap-2">
                                    <Play className="w-4 h-4 fill-current" />
                                    Watch Sermons
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                                className="rounded-full px-7 border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                            >
                                <Link to="/book-appointment" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-sky-600" />
                                    Book Appointment
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                size="lg"
                                asChild
                                className="rounded-full px-5 text-sky-700 hover:bg-sky-50 font-medium"
                            >
                                <Link to="/contact" className="flex items-center gap-1.5">
                                    Join Us This Sunday
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Quick Stats / Highlights with Icon Circles */}
                        <div className="pt-5 border-t border-slate-200/80 grid grid-cols-3 gap-3 text-left max-w-lg">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#0B1B3D] leading-tight">3+</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-tight">Weekly Services</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <Flame className="w-4 h-4 fill-amber-100" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#0B1B3D] leading-tight">Spirit-Led</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-tight">Worship & Word</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#0B1B3D] leading-tight">Deliverance</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-tight">& Prayer Ministry</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: City Harvest Style Curved / Circular Composition */}
                    <div
                        className="lg:col-span-6 relative flex justify-center items-center transition-all duration-1000 ease-out"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "scale(1)" : "scale(0.95)",
                            transitionDelay: "200ms",
                        }}
                    >
                        {/* Circle Background Rings with Ambient Glow */}
                        <div className="absolute w-[360px] h-[360px] md:w-[490px] md:h-[490px] rounded-full border border-sky-300/40 -z-0 animate-pulse-slow"></div>
                        <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-br from-sky-200/40 via-sky-100/30 to-blue-50/50 blur-xl -z-0"></div>
                        <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border border-sky-200/80 -z-0"></div>

                        {/* Main Floating Bubble composition */}
                        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">

                            {/* Primary Main Circle Photo (Worship Congregation) */}
                            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-sky-200/80 hover:ring-sky-400/90 hover:scale-105 transition-all duration-500 group bg-slate-950">
                                <img
                                    src="/hero-congregation.jpg"
                                    alt="Worship & Praise Congregation"
                                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-[1.08] contrast-[1.12]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
                                <div className="absolute bottom-7 inset-x-0 text-center text-white font-serif italic text-lg md:text-xl font-medium tracking-wide drop-shadow-lg">
                                    Worship & Praise
                                </div>
                            </div>

                            {/* Top Right Bubble Photo (Pastor on Stage) */}
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-sky-200 hover:ring-sky-400 hover:scale-105 transition-all duration-500 group bg-slate-900">
                                <img
                                    src="/hero-pastor-stage.jpg"
                                    alt="Pastor Power of Praise"
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Bottom Left Bubble Photo (Pastor at Podium with Enhanced Background) */}
                            <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20 w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-sky-200 hover:ring-sky-400 hover:scale-105 transition-all duration-500 group bg-slate-900">
                                <img
                                    src="/hero-pastor-podium.jpg"
                                    alt="Senior Pastor Preaching"
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute bottom-0 right-12 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-800">Experience Grace</p>
                                    <p className="text-[11px] text-slate-500">You're Family Here</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-Banner Bar with Faded Church Building Photo Overlay */}
            <div className="relative py-8 md:py-12 overflow-hidden border-t border-slate-200/60">
                {/* Church Building Background Image with Gradient Fade */}
                <div className="absolute inset-0 -z-0">
                    <img
                        src="/about-header-bg.jpg"
                        alt="Church Building Background"
                        className="w-full h-full object-cover object-top opacity-35 mix-blend-multiply filter contrast-125 brightness-105"
                    />
                    {/* Soft Misty White Gradient Overlay (Top and Bottom Fade) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white/60 to-[#F8FAFC]"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#0B1B3D] tracking-tight">
                        There’s more than one way to belong at{" "}
                        <span className="text-sky-600 font-extrabold">Power Of Praise Church.</span>
                    </p>
                    <div className="flex justify-center gap-2 mt-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
