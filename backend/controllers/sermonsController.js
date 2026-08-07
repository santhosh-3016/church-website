const db = require("../models/db.js");

// Get all sermons (public)
exports.getSermons = (req, res) => {
  db.query(
    "SELECT id, title, preacher, video_url AS videoUrl, thumbnail, created_at FROM sermons ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }
      res.json(results);
    }
  );
};

// Add sermon (admin)
exports.addSermon = (req, res) => {
  const { title, preacher, videoUrl, thumbnail } = req.body;

  if (!title || !preacher) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql =
    "INSERT INTO sermons (title, preacher, video_url, thumbnail) VALUES (?, ?, ?, ?)";

  db.query(sql, [title, preacher, videoUrl, thumbnail], err => {
    if (err) {
      return res.status(500).json({ message: "Insert failed" });
    }
    res.json({ message: "Sermon added successfully" });
  });
};

// Delete sermon (admin)
exports.deleteSermon = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM sermons WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sermon not found" });
      }

      res.json({ message: "Sermon deleted successfully" });
    }
  );
};

// Update sermon (admin)
exports.updateSermon = (req, res) => {
  const { id } = req.params;
  const { title, preacher, videoUrl, thumbnail } = req.body;

  if (!title || !preacher) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "UPDATE sermons SET title = ?, preacher = ?, video_url = ?, thumbnail = ? WHERE id = ?";

  db.query(sql, [title, preacher, videoUrl, thumbnail, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    res.json({ message: "Sermon updated successfully" });
  });
};
