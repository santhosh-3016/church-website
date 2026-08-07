
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/PageHero";
import { Calendar, Clock, MapPin, Users, Video, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const servicesList = [
  {
    icon: Calendar,
    title: "Sunday Worship Service",
    time: "06:00 AM, 08:30 AM & 06:30 PM",
    description: "Our main worship gatherings featuring praise, prayer, and the preaching of God's Word. Holy Communion on 2nd Sundays.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Deliverance Prayer",
    time: "Tuesday 11:00 AM",
    description: "A dedicated time for corporate prayer and spiritual warfare.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Users,
    title: "Fasting Prayer",
    time: "Friday 06:30 PM",
    description: "Deep dive into spiritual strength and seeking God's face.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Video,
    title: "Ungal Arputhathin Neram (Zoom)",
    time: "Mon, Wed, Fri 09:00 PM",
    description: "Special online prayer sessions for miracles and breakthrough.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Video,
    title: "Early Morning Prayer (Online)",
    time: "Daily 05:00 AM - 06:00 AM",
    description: "Start your day with prayer and devotion.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const ServiceItem = ({ service, index }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="group bg-white rounded-2xl p-7 shadow-sm border border-border/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row items-start gap-5">
        <div className={`shrink-0 w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <service.icon className={`w-7 h-7 ${service.iconColor}`} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className={`text-sm font-semibold mb-2 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
            {service.time}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const [locationRef, locationVisible] = useScrollReveal();

  return (
    <Layout>
      <PageHero
        badge="Weekly Gatherings"
        badgeIcon={Sparkles}
        title="Our Services"
        subtitle="Join us for worship, fellowship, and spiritual growth throughout the week."
      />

      {/* Services List */}
      <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-church-lightblue/5 rounded-full blur-3xl"></div>

        <div className="church-container">
          <div className="max-w-4xl mx-auto space-y-5">
            {servicesList.map((service, index) => (
              <ServiceItem key={service.title} service={service} index={index} />
            ))}
          </div>

          {/* Location Card */}
          <div
            ref={locationRef}
            className={`max-w-4xl mx-auto mt-14 reveal ${locationVisible ? "visible" : ""}`}
          >
            <div className="bg-gradient-to-br from-[#001030] to-[#0a2a6e] text-white rounded-2xl p-8 md:p-10 shadow-xl">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-church-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-2">
                    Visit Us
                  </h3>
                  <p className="text-white/70 text-base">
                    Power of Praise A.G Church
                  </p>
                  <p className="text-white/70 text-base">
                    Ramanatham, Tholuthur, Tamil Nadu 606303
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
