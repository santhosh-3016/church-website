
import { Play, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const SermonCard = ({ title, preacher, date, youtubeUrl, thumbnail }) => {
    // Helper to get YouTube thumbnail if not provided
    const getThumbnail = () => {
        if (thumbnail) return thumbnail;
        if (!youtubeUrl) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
        const match = youtubeUrl.match(regExp);
        return (match && match[2].length === 11)
            ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
            : null;
    };

    const displayThumbnail = getThumbnail();

    return (
        <div className="group h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden shrink-0">
                    {displayThumbnail ? (
                        <img
                            src={displayThumbnail}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#001030] to-[#0a2a6e] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-church-gold/20 to-transparent animate-pulse-slow"></div>
                            </div>
                            <Play className="w-14 h-14 text-white/40 relative z-10" />
                        </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/30 rounded-full play-pulse-ring"></div>
                            <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                                <Play className="w-6 h-6 text-primary ml-0.5" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {title}
                    </h3>

                    <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4 mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="font-medium text-foreground/70">{preacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <span className="text-foreground/50">{date}</span>
                        </div>
                    </div>

                    <Button
                        size="default"
                        className="w-full mt-2 rounded-xl bg-gradient-to-r from-church-navy to-church-blue hover:from-church-blue hover:to-church-navy shadow-sm hover:shadow-md transition-all"
                        asChild
                    >
                        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-2" />
                            Watch Now
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SermonCard;
