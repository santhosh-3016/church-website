import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    name: "ABOUT",
    path: "/about",
    subMenu: [
      { name: "Our Story", path: "/about" },
      { name: "Statement of Faith", path: "/about" },
      { name: "Leadership", path: "/about" },
    ],
  },
  {
    name: "SERVICES",
    path: "/services",
    subMenu: [
      { name: "Worship Gatherings", path: "/services" },
      { name: "Youth & NextGen", path: "/services" },
      { name: "Care Cells", path: "/services" },
    ],
  },
  { name: "SERMONS", path: "/sermons" },
  { name: "APPOINTMENTS", path: "/book-appointment" },
  { name: "GIVE", path: "/give" },
  { name: "CONNECT", path: "/contact" },

];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5"
          : "bg-white border-b border-slate-100 py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          
          {/* Logo & Church Branding */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/church-logo.jpg"
              alt="Power Of Praise A.G Church Logo"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-[#0B1B3D]/20 group-hover:border-sky-500 transition-colors shadow-sm"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-base md:text-lg font-extrabold text-[#0B1B3D] tracking-tight">
                POWER OF PRAISE
              </span>
              <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">
                A.G CHURCH
              </span>
            </div>
          </Link>

          {/* Desktop Links (City Harvest All-Caps Clean Nav) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className={`px-3 xl:px-4 py-2 rounded-md text-xs xl:text-sm font-bold tracking-wider transition-all inline-flex items-center gap-1 ${
                    isActive(link.path)
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                  {link.subMenu && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.subMenu && (
                  <div className="absolute left-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 min-w-[200px]">
                      {link.subMenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Live Stream / Admin Buttons */}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-full border-sky-600 text-sky-700 hover:bg-sky-50 text-xs font-bold px-4"
              >
                <Link to="/sermons" className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-sky-600" />
                  LIVE STREAM
                </Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="rounded-full bg-[#0B1B3D] hover:bg-sky-900 text-white text-xs font-bold px-4 shadow-sm"
              >
                <Link to="/admin/dashboard">ADMIN</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 lg:hidden transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src="/church-logo.jpg"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover border border-slate-300"
            />
            <span className="font-heading text-sm font-extrabold text-[#0B1B3D]">
              POWER OF PRAISE
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.name}>
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                  isActive(link.path)
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Button
            asChild
            className="w-full justify-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
          >
            <Link to="/book-appointment" onClick={() => setIsOpen(false)}>
              BOOK PASTOR APPOINTMENT
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full justify-center rounded-xl border-slate-300 text-slate-700 font-bold"
          >
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
              ADMIN LOGIN
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
