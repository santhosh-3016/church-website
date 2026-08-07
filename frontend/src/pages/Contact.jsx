
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["Power of Praise A.G Church", "Ramanatham, Tholuthur", "Tamil Nadu 606303"],
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 99444 79364"],
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@powerofpraise.org", "pastor@powerofpraise.org"],
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Mon - Fri: 9:00 AM - 5:00 PM", "Sat: 9:00 AM - 1:00 PM"],
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const Contact = () => {
  const [formRef, formVisible] = useScrollReveal();
  const [infoRef, infoVisible] = useScrollReveal();

  return (
    <Layout>
      <PageHero
        badge="Get In Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with any questions or prayer requests."
      />

      {/* Contact Content */}
      <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-church-lightblue/5 rounded-full blur-3xl"></div>

        <div className="church-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div
              ref={formRef}
              className={`reveal from-left ${formVisible ? "visible" : ""}`}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Send Us a Message
              </h2>
              <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-border/30">
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Subject</label>
                    <input
                      type="text"
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all resize-none"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="w-full rounded-xl bg-gradient-to-r from-church-navy to-church-blue hover:from-church-blue hover:to-church-navy shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div
              ref={infoRef}
              className={`reveal from-right ${infoVisible ? "visible" : ""}`}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Get in Touch
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.title} className="group bg-white rounded-2xl p-5 shadow-sm border border-border/30 hover:shadow-md transition-all duration-300 flex gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${info.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className={`w-5 h-5 ${info.iconColor}`} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-base">{info.title}</h3>
                      {info.details.map((detail) => (
                        <p key={detail} className="text-sm text-muted-foreground">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map */}
              <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-border/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.65338682677!2d79.0108538!3d11.4073304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab16079d6438bf%3A0x6986102a85c56836!2sPower%20of%20Praise%20A.G%20Church!5e0!3m2!1sen!2sin!4v1738564000000!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
