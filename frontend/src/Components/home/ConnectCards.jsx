import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, BookOpen, UserCheck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const connectOptions = [
    {
        icon: <MapPin className="w-5 h-5 text-[#0E6C7D]" />,
        title: "Visit Us",
        description: "Join us this Sunday for inspiring worship, Holy Spirit filled prayer, and powerful God's word.",
        linkText: "Get Directions",
        linkPath: "/contact",
    },
    {
        icon: <UserCheck className="w-5 h-5 text-[#0E6C7D]" />,
        title: "Book Pastoral Appointment",
        description: "Schedule a one-on-one personal counseling or prayer session with Senior Pastor.",
        linkText: "Book Appointment",
        linkPath: "/book-appointment",
    },
    {
        icon: <Calendar className="w-5 h-5 text-[#0E6C7D]" />,
        title: "Ministries & Youth",
        description: "Discover our vibrant ministries for Kids, Teens, Youth, and Women's fellowship groups.",
        linkText: "Explore Ministries",
        linkPath: "/services",
    },
    {
        icon: <BookOpen className="w-5 h-5 text-[#0E6C7D]" />,
        title: "Watch Sermons",
        description: "Missed a service? Access our archive of uplifting video sermons and live recordings anytime.",
        linkText: "Browse Sermons",
        linkPath: "/sermons",
    },
];

const ConnectCard = ({ option, index }) => {
    const [ref, isVisible] = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`reveal ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between text-left">
                <div>
                    <div className="w-11 h-11 rounded-xl bg-[#D0F0F3]/80 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                        {option.icon}
                    </div>

                    <h3 className="text-lg font-bold font-heading mb-2 text-[#0B1B3D] leading-snug">
                        {option.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 mb-6 leading-relaxed font-normal">
                        {option.description}
                    </p>
                </div>

                <div>
                    <Link
                        to={option.linkPath}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E6C7D] hover:bg-[#095260] text-white text-xs font-medium shadow-sm transition-all duration-300 group/btn"
                    >
                        <span>{option.linkText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ConnectCards = () => {
    const [headerRef, headerVisible] = useScrollReveal();

    return (
        <section className="py-16 md:py-20 bg-[#F8FAFC] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div
                    ref={headerRef}
                    className={`text-center max-w-2xl mx-auto mb-12 reveal ${headerVisible ? "visible" : ""}`}
                >
                    <p className="text-xs uppercase tracking-widest font-extrabold text-sky-700 mb-2">
                        Get Involved
                    </p>
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-[#0B1B3D] mb-3">
                        Ways to Connect
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        We believe church is more than a Sunday service — it's about genuine community, spiritual growth, and serving together.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {connectOptions.map((option, index) => (
                        <ConnectCard key={option.title} option={option} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConnectCards;
