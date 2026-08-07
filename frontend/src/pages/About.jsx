
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/PageHero";
import { Heart, Users, BookOpen, Music, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const values = [
  {
    icon: BookOpen,
    title: "Biblical Foundation",
    description: "We believe in the authority of Scripture and the power of the Gospel to transform lives.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Heart,
    title: "Spirit-Led Worship",
    description: "Our worship is led by the Holy Spirit, creating an atmosphere of genuine encounter with God.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Users,
    title: "Community & Fellowship",
    description: "We are a family of believers who support, encourage, and grow together in Christ.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Music,
    title: "Praise & Prayer",
    description: "Through music and intercession, we lift our voices and hearts to glorify our Lord.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const ValueCard = ({ value, index }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="group bg-white rounded-2xl p-7 shadow-sm border border-border/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center h-full">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${value.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <value.icon className={`w-7 h-7 ${value.iconColor}`} strokeWidth={2} />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {value.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {value.description}
        </p>
      </div>
    </div>
  );
};

const About = () => {
  const [storyRef, storyVisible] = useScrollReveal();

  return (
    <Layout>
      <PageHero
        badge="Our Story"
        badgeIcon={Sparkles}
        title="About Us"
        subtitle="Get to know our church family and the vision that guides us."
      />

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-church-lightblue/5 rounded-full blur-3xl"></div>

        <div className="church-container">
          <div className="max-w-4xl mx-auto">
            <div
              ref={storyRef}
              className={`reveal ${storyVisible ? "visible" : ""}`}
            >
              <div className="text-center mb-10">
                <p className="text-sm uppercase tracking-widest text-church-gold font-semibold mb-3">Our Journey</p>
                <h2 className="church-heading text-3xl md:text-4xl">A Community of Faith</h2>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border/30">
                <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
                  <p>
                    Power Of Praise A.G Church was founded with a vision to create a loving
                    community where believers could grow in their faith, experience the
                    power of the Holy Spirit, and reach out to those in need.
                  </p>
                  <p>
                    Over the years, we have seen God move in mighty ways through healing,
                    deliverance, and the transformation of countless lives. Our church
                    stands as a beacon of hope, welcoming all who seek to know Jesus Christ.
                  </p>
                  <p>
                    We are committed to preaching the full Gospel, nurturing spiritual
                    growth, and serving our community with compassion and love.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-church-blue/3 rounded-full blur-3xl"></div>

        <div className="church-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-widest text-church-gold font-semibold mb-3">What We Believe</p>
            <h2 className="church-heading text-3xl md:text-4xl">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
