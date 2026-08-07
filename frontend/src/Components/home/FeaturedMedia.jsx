
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FeaturedMedia = () => {
    const [ref, isVisible] = useScrollReveal();

    return (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
            {/* Decorative bg */}
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-church-lightblue/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="container mx-auto px-4 md:px-6">
                <div
                    ref={ref}
                    className={`reveal ${isVisible ? "visible" : ""} max-w-6xl mx-auto`}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Video / Media Block */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
                            <img
                                src="/worship-background.webp"
                                alt="Latest Sermon"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-300"></div>

                            {/* Play Button with pulsing ring */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    {/* Pulse ring */}
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/30 play-pulse-ring"></div>
                                    <div className="relative w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* "Latest" badge */}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-church-gold text-xs font-bold uppercase tracking-wider rounded-full text-[#001030]">
                                    Latest
                                </span>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-5">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-semibold text-sm">
                                Featured Sermon
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight text-foreground">
                                Walking in Faith
                                <span className="block text-primary">and Victory</span>
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                Join us as we explore what it means to trust God completely in our daily lives.
                                Discover the biblical principles that lead to a victorious life, no matter the circumstances.
                            </p>
                            <div className="pt-2">
                                <Button size="lg" asChild className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-church-navy to-church-blue hover:from-church-blue hover:to-church-navy">
                                    <Link to="/sermons">
                                        <Play className="w-4 h-4 mr-2" />
                                        Watch Full Message
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedMedia;
