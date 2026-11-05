import { MapPin, Radio, Calendar, Users, ArrowRight, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const campusCards = [
    {
        icon: MapPin,
        title: "MAIN SANCTUARY",
        subtitle: "Sunday Worship Services",
        description: "Welcome to Power Of Praise A.G. Church Main Sanctuary. Join our vibrant Sunday Worship Services with Holy Communion on 1st Sundays.",
        timings: [
            { label: "1st Service", time: "6:00 AM – 8:00 AM" },
            { label: "2nd Service", time: "8:30 AM – 10:30 AM" },
            { label: "Evening Worship", time: "6:30 PM – 8:30 PM" },
        ],
        btnText: "Location & Directions",
        btnPath: "/contact",
        isPrimary: false,
    },
    {
        icon: Calendar,
        title: "MID-WEEK PRAYERS",
        subtitle: "Deliverance & Fasting",
        description: "Experience breakthrough through intercessory prayer, fasting, and biblical teaching throughout the week.",
        timings: [
            { label: "Deliverance Prayer", time: "Tuesday: 11:00 AM" },
            { label: "Fasting Prayer", time: "Friday: 6:30 PM" },
            { label: "Early Devotion", time: "Daily: 5:00 AM – 6:00 AM" },
        ],
        btnText: "Prayer Meetings",
        btnPath: "/services",
        isPrimary: false,
    },
    {
        icon: Users,
        title: "NEXT GEN & CARE CELLS",
        subtitle: "Youth, Kids & Families",
        description: "Building strong faith foundations for children, youth, and small cottage prayer cells in local neighborhoods.",
        timings: [
            { label: "Youth Meeting", time: "Tuesday: 6:00 PM" },
            { label: "Kids Bible Club", time: "Sunday: 7:00 AM" },
            { label: "Online Zoom Prayer", time: "Mon, Wed, Fri: 9:00 PM" },
        ],
        btnText: "Youth & Care Cells",
        btnPath: "/services",
        isPrimary: false,
    },
    {
        icon: Radio,
        title: "LIVE STREAM",
        subtitle: "Watch Online Anywhere",
        description: "Never miss a Sunday Worship Service. Join our online livestream every Sunday from wherever you are around the globe.",
        timings: [
            { label: "Live Service Broadcast", time: "Every Sunday at 6:00 AM,8:30 AM" },
            { label: "Special Zoom Meetings", time: "Mon, Wed, Fri at 9:00 PM" },
        ],
        btnText: "Latest Live Stream",
        btnPath: "/sermons",
        isPrimary: true,
    },
];

const ServiceTimesSection = () => {
    const [headerRef, headerVisible] = useScrollReveal();

    return (
        <section className="py-20 bg-slate-100/70 border-t border-slate-200 relative">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* Header Subtitle like City Harvest */}
                <div 
                    ref={headerRef} 
                    className={`text-center max-w-3xl mx-auto mb-14 reveal ${headerVisible ? "visible" : ""}`}
                >
                    <p className="text-xl md:text-2xl text-slate-700 font-normal">
                        Explore our service schedules, connect online, or join a community near you.
                    </p>
                </div>

                {/* 4-Column Campus/Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {campusCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div 
                                key={card.title} 
                                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Icon Top Header */}
                                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-sky-50 text-slate-600 group-hover:text-sky-600 flex items-center justify-center mb-6 transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Card Title */}
                                    <h3 className="font-heading text-xl font-extrabold text-[#0B1B3D] tracking-tight leading-snug mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs uppercase tracking-wider font-semibold text-sky-600 mb-4">
                                        {card.subtitle}
                                    </p>

                                    {/* Description */}
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {card.description}
                                    </p>

                                    {/* Timings Block */}
                                    <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                            Service Timings
                                        </p>
                                        {card.timings.map((item, i) => (
                                            <div key={i} className="text-sm">
                                                <span className="font-semibold text-slate-700 block">{item.label}:</span>
                                                <span className="text-slate-500 font-medium">{item.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* City Harvest Style Pill Button */}
                                <div>
                                    <Link
                                        to={card.btnPath}
                                        className={`w-full py-3 px-5 rounded-xl font-bold text-sm inline-flex items-center justify-between transition-all ${
                                            card.isPrimary 
                                                ? "bg-sky-600 hover:bg-sky-700 text-white shadow-md" 
                                                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                                        }`}
                                    >
                                        <span>{card.btnText}</span>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${card.isPrimary ? "bg-white/20 text-white" : "bg-white text-slate-800"}`}>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Location Footer Bar */}
                <div className="mt-14 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm text-slate-700">
                        <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
                        <span className="text-sm font-medium">
                            <strong>Main Location:</strong> Power of Praise A.G Church, Ramanatham, Tholuthur, Tamil Nadu 606303
                        </span>
                        <Link to="/contact" className="text-sky-600 hover:underline text-sm font-semibold sm:ml-2">
                            Get Directions ➔
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ServiceTimesSection;
