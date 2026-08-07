import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, HeartHandshake, BookOpen, UserCheck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const connectOptions = [
    {
        icon: <MapPin className="w-6 h-6" />,
        title: "Visit Us",
        description: "Join us this Sunday for inspiring worship, Holy Spirit filled prayer, and powerful God's word.",
        linkText: "Get Directions",
        linkPath: "/contact",
        iconBg: "bg-sky-50 text-sky-600",
    },
    {
        icon: <UserCheck className="w-6 h-6" />,
        title: "Book Pastoral Appointment",
        description: "Schedule a one-on-one personal counseling or prayer session with Senior Pastor.",
        linkText: "Book Appointment",
        linkPath: "/book-appointment",
        iconBg: "bg-blue-50 text-blue-700",
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: "Ministries & Youth",
        description: "Discover our vibrant ministries for Kids, Teens, Youth, and Women's fellowship groups.",
        linkText: "Explore Ministries",
        linkPath: "/services",
        iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Watch Sermons",
        description: "Missed a service? Access our archive of uplifting video sermons and live recordings anytime.",
        linkText: "Browse Sermons",
        linkPath: "/sermons",
        iconBg: "bg-[#0B1B3D]/10 text-[#0B1B3D]",
    },
];

const ConnectCard = ({ option, index }) => {
    const [ref, isVisible] = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`reveal ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: `${index * 120}ms` }}
        >
            <div className="group bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                    <div className={`w-12 h-12 rounded-xl ${option.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        {option.icon}
                    </div>

                    <h3 className="text-lg font-bold font-heading mb-2 text-[#0B1B3D] group-hover:text-sky-600 transition-colors">
                        {option.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed font-normal">
                        {option.description}
                    </p>
                </div>

                <Link
                    to={option.linkPath}
                    className="inline-flex items-center text-sm font-bold text-sky-700 hover:text-[#0B1B3D] transition-colors group/link pt-3 border-t border-slate-100"
                >
                    <span>{option.linkText}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

const ConnectCards = () => {
    const [headerRef, headerVisible] = useScrollReveal();

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div
                    ref={headerRef}
                    className={`text-center max-w-2xl mx-auto mb-14 reveal ${headerVisible ? "visible" : ""}`}
                >
                    <p className="text-xs uppercase tracking-widest font-bold text-sky-600 mb-2">
                        Get Involved
                    </p>
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-[#0B1B3D] mb-4">
                        Ways to Connect
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg">
                        We believe church is more than a Sunday service — it's about genuine community, spiritual growth, and serving together.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {connectOptions.map((option, index) => (
                        <ConnectCard key={option.title} option={option} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConnectCards;
