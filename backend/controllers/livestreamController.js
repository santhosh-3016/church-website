const db = require("../models/db.js");

// Extract YouTube Video ID from various YouTube URL formats
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Get current live stream status (Public)
exports.getLiveStreamStatus = (req, res) => {
  db.query(
    "SELECT id, is_live, video_url, stream_title, stream_description, updated_at FROM livestream_settings WHERE id = 1",
    (err, results) => {
      if (err) {
        console.error("Failed to fetch livestream status:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.json({
          success: true,
          is_live: false,
          video_url: "",
          video_id: null,
          embed_url: null,
          stream_title: "Sunday Morning Worship Service",
          stream_description: "Join us live for worship and preaching."
        });
      }

      const record = results[0];
      const videoId = extractYouTubeId(record.video_url);
      const isLive = Boolean(record.is_live);
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

      res.json({
        success: true,
        is_live: isLive,
        video_url: record.video_url || "",
        video_id: videoId,
        embed_url: embedUrl,
        stream_title: record.stream_title || "Sunday Morning Worship Service",
        stream_description: record.stream_description || "",
        updated_at: record.updated_at
      });
    }
  );
};

// Update live stream status (Admin)
exports.updateLiveStreamStatus = (req, res) => {
  const { is_live, video_url, stream_title, stream_description } = req.body;

  const isLiveVal = is_live ? 1 : 0;
  const videoUrlVal = video_url || "";
  const titleVal = stream_title || "Sunday Morning Worship Service";
  const descVal = stream_description || "";

  const sql = `
    INSERT INTO livestream_settings (id, is_live, video_url, stream_title, stream_description)
    VALUES (1, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      is_live = VALUES(is_live),
      video_url = VALUES(video_url),
      stream_title = VALUES(stream_title),
      stream_description = VALUES(stream_description);
  `;

  db.query(sql, [isLiveVal, videoUrlVal, titleVal, descVal], (err, result) => {
    if (err) {
      console.error("Failed to update livestream settings:", err);
      return res.status(500).json({ success: false, message: "Failed to update status" });
    }

    const videoId = extractYouTubeId(videoUrlVal);
    res.json({
      success: true,
      message: isLiveVal ? "🔴 Live Stream is NOW LIVE!" : "⚪ Live Stream is NOW OFFLINE",
      settings: {
        is_live: Boolean(isLiveVal),
        video_url: videoUrlVal,
        video_id: videoId,
        embed_url: videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null,
        stream_title: titleVal,
        stream_description: descVal
      }
    });
  });
};
