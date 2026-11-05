import { useState, useEffect } from "react";
import { Play, Radio, Volume2, Share2, Heart, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const LiveStreamBanner = () => {
  const [streamData, setStreamData] = useState({
    is_live: false,
    embed_url: null,
    video_id: null,
    stream_title: "",
    stream_description: ""
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchLiveStatus = async () => {
    try {
      const res = await fetch("/api/livestream");
      const data = await res.json();
      if (data.success) {
        setStreamData(data);
      }
    } catch (err) {
      console.error("Error checking live stream status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    // Poll status every 25 seconds to seamlessly show/hide live stream as status changes
    const interval = setInterval(fetchLiveStatus, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // IF NOT LIVE OR NO EMBED URL, RENDER NOTHING (DISAPPEARS COMPLETELY)
  if (loading || !streamData.is_live || !streamData.embed_url) {
    return null;
  }

  return (
    <section
      id="live-stream-section"
      className="relative w-full bg-slate-950 text-white pt-24 md:pt-32 pb-10 md:pb-16 border-b border-rose-900/30 shadow-2xl z-20"
    >
      {/* Background Decorative Pulsing Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/15 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-600/15 rounded-full filter blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Live Top Header Badge Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
            </span>
            <span className="bg-rose-600 text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse shrink-0">
              <Radio className="w-3.5 h-3.5" />
              WE ARE LIVE NOW
            </span>
            <span className="text-slate-300 text-xs font-semibold hidden sm:inline-block">
              Power of Praise AG Church Divine Broadcast
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-full gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              {copied ? "Link Copied!" : "Share Broadcast"}
            </Button>

            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-full gap-1.5 shadow-md"
            >
              <a href="/give">
                <Heart className="w-3.5 h-3.5 fill-slate-950" />
                Online Giving
              </a>
            </Button>
          </div>
        </div>

        {/* Video & Info Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Embedded YouTube Video Player */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-rose-500/30 aspect-video relative">
            <iframe
              src={streamData.embed_url}
              title={streamData.stream_title || "Church Live Broadcast"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Stream Info Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 h-full">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-950/80 border border-sky-500/30 text-sky-400 text-xs font-bold">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                JOIN THE WORSHIP & WORD
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug font-heading">
                {streamData.stream_title || "Sunday Divine Worship Service"}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                {streamData.stream_description && streamData.stream_description.toLowerCase() !== "offline"
                  ? streamData.stream_description
                  : "Welcome to our live online service! Experience the worship, prayer, and life-changing sermon with our church family today."}
              </p>
            </div>

            {/* Quick Interactive Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <a
                href={`https://www.youtube.com/watch?v=${streamData.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-rose-900/40"
              >
                <MessageSquare className="w-4 h-4" />
                Open Live Chat on YouTube
              </a>

              <a
                href="/book-appointment"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-sky-400" />
                Request Personal Prayer / Appointment
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStreamBanner;
