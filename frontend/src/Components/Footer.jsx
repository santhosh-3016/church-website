import { Heart, Instagram, Youtube, Facebook, MapPin, Phone, MessageCircle, Mail, ArrowUpRight, Radio } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <footer className="bg-[#0B1B3D] text-white relative overflow-hidden pt-16 pb-12 border-t border-slate-800">
                <div className="container mx-auto px-4 md:px-6">
                    
                    {/* Top Footer Callout Bar */}
                    <div className="bg-sky-900/40 rounded-2xl p-6 md:p-8 mb-14 border border-sky-700/30 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                                <Radio className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-heading text-lg font-bold text-white">Join Our Sunday Live Stream</h3>
                                <p className="text-sky-200/80 text-sm">Worship with us from anywhere around the world every Sunday at 8:30 AM IST.</p>
                            </div>
                        </div>
                        <Link 
                            to="/sermons" 
                            className="shrink-0 px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-colors shadow-md"
                        >
                            Watch Live Stream
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
                        {/* Church Info */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <img 
                                    src="/church-logo.jpg" 
                                    alt="Logo" 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-sky-400/40" 
                                />
                                <div>
                                    <span className="font-heading text-lg font-extrabold block leading-tight text-white">
                                        POWER OF PRAISE
                                    </span>
                                    <span className="text-sky-400 text-xs font-bold tracking-wider uppercase">
                                        A.G CHURCH
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                A welcoming Pentecostal community dedicated to sharing God's love, empowering believers, and making disciples.
                            </p>
                            
                            {/* Social Icons */}
                            <div className="flex gap-2.5 pt-2">
                                {[
                                    { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                                    { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                                    { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                                ].map(({ Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-600 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Navigation Links */}
                        <div className="space-y-4">
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-sky-400">
                                QUICK LINKS
                            </h4>
                            <ul className="space-y-2.5 text-sm font-medium">
                                {[
                                    { label: "Home", path: "/" },
                                    { label: "About Us & Values", path: "/about" },
                                    { label: "Worship Services", path: "/services" },
                                    { label: "Sermons & Media", path: "/sermons" },
                                    { label: "Book Pastor Appointment", path: "/book-appointment" },
                                    { label: "Contact & Location", path: "/contact" },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                                        >
                                            <span className="text-sky-500 font-bold">›</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Service Schedule */}
                        <div className="space-y-4">
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-sky-400">
                                SERVICE TIMES
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-bold text-white">Sunday Worship Services</p>
                                    <p className="text-slate-300 text-xs mt-0.5">6:00 AM  • 8:30 AM (Tamil) • 6:30 PM (Evening)</p>
                                </div>
                                <div>
                                    <p className="font-bold text-white">Deliverance Prayer</p>
                                    <p className="text-slate-300 text-xs mt-0.5">Every Tuesday at 11:00 AM</p>
                                </div>
                                <div>
                                    <p className="font-bold text-white">Fasting Prayer</p>
                                    <p className="text-slate-300 text-xs mt-0.5">Every Friday at 6:30 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Location & Contact */}
                        <div className="space-y-4">
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-sky-400">
                                CONTACT US
                            </h4>
                            <div className="space-y-3.5 text-sm text-slate-300">
                                <a
                                    href="https://maps.google.com/?q=Power+of+Praise+A.G+Church+Ramanatham+Tholuthur"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 hover:text-white transition-colors"
                                >
                                    <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                                    <span>
                                        Power of Praise A.G Church,<br />
                                        Ramanatham, Tholuthur,<br />
                                        Tamil Nadu 606303
                                    </span>
                                </a>
                                <a href="tel:+919944479364" className="flex items-center gap-3 hover:text-white transition-colors">
                                    <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                                    <span>+91 99444 79364</span>
                                </a>
                                <a href="mailto:info@powerofpraise.org" className="flex items-center gap-3 hover:text-white transition-colors">
                                    <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                                    <span>info@powerofpraise.org</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>© {new Date().getFullYear()} Power Of Praise A.G Church. All rights reserved.</p>
                        <p className="flex items-center gap-1.5">
                            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for God's glory
                        </p>
                    </div>

                </div>
            </footer>

            {/* WhatsApp Floating Action Button */}
            <a
                href="https://wa.me/919944479364"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
                aria-label="Contact on WhatsApp"
            >
                <MessageCircle className="w-7 h-7 fill-current" />
            </a>
        </>
    );
};

export default Footer;
