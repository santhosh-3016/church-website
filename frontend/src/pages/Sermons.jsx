
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/PageHero";
import SermonCard from "@/components/sermons/SermonCard";
import { Search, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRef, searchVisible] = useScrollReveal();

  useEffect(() => {
    fetch("/api/sermons")
      .then((res) => res.json())
      .then((data) => setSermons(data))
      .catch((err) => console.error("Error fetching sermons:", err));
  }, []);

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <PageHero
        badge="Messages from the Pulpit"
        badgeIcon={Sparkles}
        title="Sermons"
        subtitle="Watch and be blessed by powerful messages from our pulpit. Let the Word of God transform your life."
      />

      {/* Sermons List */}
      <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-church-lightblue/5 rounded-full blur-3xl"></div>

        <div className="church-container">
          {/* Search Bar */}
          <div
            ref={searchRef}
            className={`max-w-xl mx-auto mb-14 reveal ${searchVisible ? "visible" : ""}`}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search by title or preacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Sermons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredSermons.length > 0 ? (
              filteredSermons.map((sermon, index) => (
                <div
                  key={sermon.id}
                  className="reveal visible"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <SermonCard
                    title={sermon.title}
                    preacher={sermon.preacher}
                    date={new Date(sermon.created_at).toLocaleDateString()}
                    youtubeUrl={sermon.videoUrl}
                    thumbnail={sermon.thumbnail}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">No sermons found.</p>
                <p className="text-muted-foreground/60 text-sm mt-1">Try a different search term.</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredSermons.length > 0 && (
            <div className="text-center mt-14">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-border/40 text-foreground font-semibold rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                Load More Sermons
                <span className="text-base">↓</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Sermons;
