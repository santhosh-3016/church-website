import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

// Helper to get YouTube thumbnail
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : null;
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Sermon State
  const [title, setTitle] = useState("");
  const [preacher, setPreacher] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [sermons, setSermons] = useState([]);

  // Sermon Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPreacher, setEditPreacher] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");

  // Appointment State
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("sermons");

  // Member State
  const [members, setMembers] = useState([]);
  const [memberForm, setMemberForm] = useState({
    name: '', age: '', gender: '', address: '', phone: '', email: '',
    dob: '', membershipDate: '', notes: ''
  });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberMessage, setMemberMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Donation / Giving State
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({ total_amount: 0, total_count: 0, by_category: [] });
  const [donationCategoryFilter, setDonationCategoryFilter] = useState("All");
  const [donationSearchTerm, setDonationSearchTerm] = useState("");

  // Live Stream State
  const [liveStreamSettings, setLiveStreamSettings] = useState({
    is_live: false,
    video_url: "",
    stream_title: "Sunday Morning Divine Worship Service",
    stream_description: "Join us live for praise, worship, and the Word of God.",
    video_id: null,
    embed_url: null
  });
  const [liveStreamMsg, setLiveStreamMsg] = useState("");
  const [liveStreamSaving, setLiveStreamSaving] = useState(false);

  useEffect(() => {
    fetchSermons();
    fetchAppointments();
    fetchMembers();
    fetchDonations();
    fetchLiveStream();
  }, []);

  const fetchLiveStream = async () => {
    try {
      const res = await fetch("/api/livestream");
      const data = await res.json();
      if (data.success) {
        setLiveStreamSettings(data);
      }
    } catch (err) {
      console.error("Failed to load live stream settings");
    }
  };

  const handleSaveLiveStream = async (overrideIsLive) => {
    setLiveStreamSaving(true);
    setLiveStreamMsg("");
    try {
      const targetLive = overrideIsLive !== undefined ? overrideIsLive : liveStreamSettings.is_live;
      const payload = {
        is_live: targetLive,
        video_url: liveStreamSettings.video_url,
        stream_title: liveStreamSettings.stream_title,
        stream_description: liveStreamSettings.stream_description
      };

      const res = await fetch("/api/livestream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setLiveStreamSettings(data.settings);
        setLiveStreamMsg(data.message);
      } else {
        setLiveStreamMsg(data.message || "Failed to update live stream");
      }
    } catch (err) {
      setLiveStreamMsg("Error saving live stream settings");
    } finally {
      setLiveStreamSaving(false);
    }
  };

  const handleArchiveLiveStreamToSermons = async () => {
    if (!liveStreamSettings.video_url || !liveStreamSettings.stream_title) {
      alert("Please ensure Video URL and Title are filled before saving to Sermons.");
      return;
    }
    try {
      const payload = {
        title: liveStreamSettings.stream_title,
        preacher: "Pastor / Speaker",
        videoUrl: liveStreamSettings.video_url,
        thumbnail: liveStreamSettings.video_id ? `https://img.youtube.com/vi/${liveStreamSettings.video_id}/hqdefault.jpg` : ""
      };
      const res = await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      fetchSermons();
      alert("✅ Live stream has been saved to Sermons library successfully!");
    } catch (err) {
      alert("Failed to archive sermon");
    }
  };


  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/donations");
      const data = await res.json();
      if (data.success) {
        setDonations(data.donations || []);
      }
      
      const statsRes = await fetch("/api/donations/stats");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setDonationStats(statsData.stats || { total_amount: 0, total_count: 0, by_category: [] });
      }
    } catch (err) {
      console.error("Failed to load donations");
    }
  };

  const fetchSermons = async () => {
    try {
      const res = await fetch("/api/sermons");
      const data = await res.json();
      setSermons(data);
    } catch (err) {
      console.error("Failed to load sermons");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  /* --- SERMON HANDLERS --- */
  const handleAddSermon = async (e) => {
    e.preventDefault();
    setMessage("");

    const thumbnail = getYouTubeThumbnail(videoUrl);

    try {
      const res = await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, preacher, videoUrl, thumbnail })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error adding sermon");
        return;
      }

      setMessage("Sermon added successfully");
      setTitle("");
      setPreacher("");
      setVideoUrl("");
      fetchSermons();
    } catch (err) {
      setMessage("Server error");
    }
  };

  const startEdit = (sermon) => {
    setEditingId(sermon.id);
    setEditTitle(sermon.title);
    setEditPreacher(sermon.preacher);
    setEditVideoUrl(sermon.videoUrl || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPreacher("");
    setEditVideoUrl("");
  };

  const saveEdit = async () => {
    const thumbnail = getYouTubeThumbnail(editVideoUrl);

    try {
      const res = await fetch(`/api/sermons/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          preacher: editPreacher,
          videoUrl: editVideoUrl,
          thumbnail
        })
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      setEditingId(null);
      fetchSermons();
    } catch (err) {
      alert("Error updating sermon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sermon?")) return;

    try {
      await fetch(`/api/sermons/${id}`, {
        method: "DELETE"
      });
      fetchSermons();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* --- APPOINTMENT HANDLERS --- */
  const handleAppointmentStatus = async (id, status, admin_response = "") => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_response })
      });
      const data = await res.json();
      fetchAppointments();
      
      if (data.whatsapp_link) {
        // Open WhatsApp Web/App pre-filled with the status update message
        window.open(data.whatsapp_link, "_blank");
      }
    } catch (err) {
      alert("Status update failed");
    }
  };

  /* --- MEMBER HANDLERS --- */
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members");
    }
  };

  const handleMemberChange = (e) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberMessage('');

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setMemberMessage(data.message || 'Error adding member');
        return;
      }

      setMemberMessage('Member added successfully');
      setMemberForm({
        name: '', age: '', gender: '', address: '', phone: '', email: '',
        dob: '', membershipDate: '', notes: ''
      });
      fetchMembers();
    } catch (err) {
      setMemberMessage('Server error');
    }
  };

  const startMemberEdit = (member) => {
    setEditingMemberId(member.id);
    setMemberForm({
      name: member.name || '',
      age: member.age || '',
      gender: member.gender || '',
      address: member.address || '',
      phone: member.phone || '',
      email: member.email || '',
      dob: member.dob || '',
      membershipDate: member.membershipDate || '',
      notes: member.notes || ''
    });
  };

  const saveMemberEdit = async () => {
    try {
      await fetch(`/api/members/${editingMemberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      });

      setEditingMemberId(null);
      setMemberForm({
        name: '', age: '', gender: '', address: '', phone: '', email: '',
        dob: '', membershipDate: '', notes: ''
      });
      fetchMembers();
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Delete this member?')) return;

    try {
      await fetch(`/api/members/${id}`, {
        method: 'DELETE'
      });
      fetchMembers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-church-blue">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="secondary" className="px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
          Logout
        </Button>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 font-bold ${activeTab === 'sermons' ? 'text-church-blue border-b-2 border-church-gold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sermons')}
        >
          Manage Sermons
        </button>
        <button
          className={`pb-2 px-4 font-bold ${activeTab === 'appointments' ? 'text-church-blue border-b-2 border-church-gold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointment Requests
        </button>
        <button
          className={`pb-2 px-4 font-bold ${activeTab === 'members' ? 'text-church-blue border-b-2 border-church-gold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('members')}
        >
          Church Members
        </button>
        <button
          className={`pb-2 px-4 font-bold ${activeTab === 'donations' ? 'text-church-blue border-b-2 border-church-gold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('donations')}
        >
          Offerings & Tithes
        </button>
        <button
          className={`pb-2 px-4 font-bold flex items-center gap-1.5 ${activeTab === 'livestream' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('livestream')}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${liveStreamSettings.is_live ? 'bg-rose-600 animate-ping' : 'bg-slate-400'}`} />
          Live Stream Control
        </button>
      </div>


      {activeTab === 'sermons' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Sermon Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-church-blue mb-6">Add New Sermon</h2>
              {message && (
                <div className={`p-3 rounded mb-4 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleAddSermon} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                  <input
                    type="text"
                    placeholder="Sermon Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Preacher</label>
                  <input
                    type="text"
                    placeholder="Preacher Name"
                    value={preacher}
                    onChange={(e) => setPreacher(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Video URL</label>
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  />
                </div>
                <Button type="submit" variant="primary" className="mt-2">
                  Add Sermon
                </Button>
              </form>
            </Card>
          </div>

          {/* List Sermons */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-church-blue">All Sermons</h2>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">{sermons.length} sermons</span>
            </div>

            <div className="space-y-4">
              {sermons.length === 0 && <p className="text-gray-500 italic">No sermons found.</p>}
              {sermons.map((sermon) => (
                <div key={sermon.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {(sermon.thumbnail || getYouTubeThumbnail(sermon.videoUrl)) && (
                    <img src={sermon.thumbnail || getYouTubeThumbnail(sermon.videoUrl)} alt={sermon.title} className="w-full md:w-32 h-20 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-grow w-full">
                    {editingId === sermon.id ? (
                      <div className="grid gap-3 p-4 bg-gray-50 rounded-lg">
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="p-2 border rounded w-full" placeholder="Title" />
                        <input value={editPreacher} onChange={(e) => setEditPreacher(e.target.value)} className="p-2 border rounded w-full" placeholder="Preacher" />
                        <input value={editVideoUrl} onChange={(e) => setEditVideoUrl(e.target.value)} className="p-2 border rounded w-full" placeholder="Video URL" />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={saveEdit} className="py-1 px-3 text-sm bg-green-600 hover:bg-green-700 text-white">Save</Button>
                          <Button onClick={() => setEditingId(null)} variant="secondary" className="py-1 px-3 text-sm">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg text-church-blue">{sermon.title}</h3>
                        <div className="text-sm text-gray-600 mt-1 flex gap-4">
                          <span>👤 {sermon.preacher}</span>
                          {sermon.videoUrl && <a href={sermon.videoUrl} target="_blank" className="text-blue-500 hover:underline">📺 Watch link</a>}
                        </div>
                      </>
                    )}
                  </div>

                  {editingId !== sermon.id && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(sermon)} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(sermon.id)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium transition-colors">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'appointments' ? (
        /* APPOINTMENTS TAB */
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-church-blue">Appointment Requests</h2>
            <button
              onClick={fetchAppointments}
              className="text-sm text-blue-600 hover:underline"
            >
              ↻ Refresh List
            </button>
          </div>

          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-lg">No appointment requests yet.</p>
          ) : (
            <div className="grid gap-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          apt.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                          apt.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                          apt.status === 'reschedule' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-sky-100 text-sky-700 border border-sky-200'
                        }`}>
                          {apt.status}
                        </span>
                        <span className="text-gray-400 text-xs">{apt.created_at?.substring(0, 10)}</span>
                      </div>

                      <h3 className="font-bold text-lg text-church-blue">{apt.topic}</h3>
                      <p className="text-gray-600 mt-1">
                        <span className="font-semibold text-sky-700">{apt.day} @ {apt.slot}</span>
                      </p>

                      <div className="mt-3 text-sm space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p><strong>Name:</strong> {apt.name}</p>
                        <p><strong>Phone:</strong> <a href={`tel:${apt.phone}`} className="text-sky-600 hover:underline">{apt.phone}</a></p>
                        <p><strong>Email:</strong> {apt.email || <span className="text-gray-400 font-normal">Not provided</span>}</p>
                        {apt.message && <p className="mt-1 text-slate-600 italic">"Client Note: {apt.message}"</p>}
                        {apt.admin_response && (
                          <p className="mt-2 text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200 text-xs">
                            💬 <strong>Pastor's Note:</strong> "{apt.admin_response}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                      <div className="mb-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pastor's Response Note</label>
                        <input
                          type="text"
                          id={`note-${apt.id}`}
                          placeholder="e.g. Approved for Room 2 / Call office"
                          defaultValue={apt.admin_response || ''}
                          className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                const note = document.getElementById(`note-${apt.id}`)?.value || '';
                                handleAppointmentStatus(apt.id, 'approved', note);
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-sm"
                            >
                              ✅ Approve & Notify
                            </button>
                            <button
                              onClick={() => {
                                const note = document.getElementById(`note-${apt.id}`)?.value || '';
                                handleAppointmentStatus(apt.id, 'rejected', note);
                              }}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-all shadow-sm"
                            >
                              ❌ Reject Request
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            const note = document.getElementById(`note-${apt.id}`)?.value || '';
                            handleAppointmentStatus(apt.id, 'reschedule', note);
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold transition-all shadow-sm"
                        >
                          🔄 Reschedule
                        </button>

                        {apt.whatsapp_link && (
                          <a
                            href={apt.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold transition-all shadow-sm text-center flex items-center justify-center gap-1.5 mt-1"
                          >
                            💬 Send via WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'members' ? (
        /* MEMBERS TAB */
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Member Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-church-blue mb-6">
                {editingMemberId ? 'Edit Member' : 'Add New Member'}
              </h2>
              {memberMessage && (
                <div className={`p-3 rounded mb-4 text-sm ${memberMessage.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {memberMessage}
                </div>
              )}
              <form onSubmit={editingMemberId ? (e) => { e.preventDefault(); saveMemberEdit(); } : handleAddMember} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={memberForm.name}
                    onChange={handleMemberChange}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Age</label>
                    <input
                      type="number"
                      name="age"
                      placeholder="25"
                      value={memberForm.age}
                      onChange={handleMemberChange}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                    <select
                      name="gender"
                      value={memberForm.gender}
                      onChange={handleMemberChange}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={memberForm.address}
                    onChange={handleMemberChange}
                    rows={2}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={memberForm.phone}
                      onChange={handleMemberChange}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={memberForm.email}
                      onChange={handleMemberChange}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={memberForm.dob}
                    onChange={handleMemberChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  />
                </div>



                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Membership Date</label>
                  <input
                    type="date"
                    name="membershipDate"
                    value={memberForm.membershipDate}
                    onChange={handleMemberChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Notes</label>
                  <textarea
                    name="notes"
                    placeholder="Additional information..."
                    value={memberForm.notes}
                    onChange={handleMemberChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-church-blue resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingMemberId ? 'Update Member' : 'Add Member'}
                  </Button>
                  {editingMemberId && (
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingMemberId(null);
                        setMemberForm({
                          name: '', age: '', gender: '', address: '', phone: '', email: '',
                          dob: '', birthBaptismDate: '', waterBaptismDate: '', membershipDate: '', notes: ''
                        });
                      }}
                      variant="secondary"
                      className="px-4"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Members List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-church-blue">All Members</h2>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">{members.length} members</span>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
              />
            </div>

            <div className="space-y-4">
              {filteredMembers.length === 0 && <p className="text-gray-500 italic">No members found.</p>}
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-church-blue mb-2">{member.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        {member.age && <p><strong>Age:</strong> {member.age}</p>}
                        {member.gender && <p><strong>Gender:</strong> {member.gender}</p>}
                        {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
                        {member.email && <p><strong>Email:</strong> {member.email}</p>}
                        {member.dob && <p><strong>DOB:</strong> {new Date(member.dob).toLocaleDateString()}</p>}
                        {member.membershipDate && <p><strong>Member Since:</strong> {new Date(member.membershipDate).toLocaleDateString()}</p>}
                      </div>
                      {member.address && <p className="text-sm text-gray-600 mt-2"><strong>Address:</strong> {member.address}</p>}
                      {member.notes && <p className="text-sm text-gray-500 mt-2 italic">"{member.notes}"</p>}
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => startMemberEdit(member)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'donations' ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Received</span>
              <p className="text-2xl font-extrabold text-[#0B1B3D] mt-1">
                ₹{Number(donationStats.total_amount || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-green-600 font-semibold mt-1">From {donationStats.total_count || 0} transactions</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sunday Tithes</span>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">
                ₹{Number((donationStats.by_category?.find(c => c.category === 'Sunday Tithe')?.total) || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">First Fruits Offering</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">General Offering</span>
              <p className="text-2xl font-extrabold text-sky-600 mt-1">
                ₹{Number((donationStats.by_category?.find(c => c.category === 'General Offering')?.total) || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Church & Ministry Care</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Building & Missions</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                ₹{Number(
                  ((donationStats.by_category?.find(c => c.category === 'Building & Facility Fund')?.total) || 0) +
                  ((donationStats.by_category?.find(c => c.category === 'Missions & Charity')?.total) || 0)
                ).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Facility & Outreach</p>
            </div>
          </div>

          {/* Controls Bar: Search & Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search donor name, email, or order ID..."
                value={donationSearchTerm}
                onChange={(e) => setDonationSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase">Category:</span>
              <select
                value={donationCategoryFilter}
                onChange={(e) => setDonationCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Categories</option>
                <option value="Sunday Tithe">Sunday Tithe</option>
                <option value="General Offering">General Offering</option>
                <option value="Building & Facility Fund">Building & Facility Fund</option>
                <option value="Missions & Charity">Missions & Charity</option>
              </select>

              <button
                onClick={fetchDonations}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Donations Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Receipt / Order ID</th>
                    <th className="px-6 py-4">Donor Name & Email</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations
                    .filter((item) => {
                      const matchesCategory = donationCategoryFilter === "All" || item.category === donationCategoryFilter;
                      const matchesSearch = !donationSearchTerm ||
                        item.donor_name?.toLowerCase().includes(donationSearchTerm.toLowerCase()) ||
                        item.donor_email?.toLowerCase().includes(donationSearchTerm.toLowerCase()) ||
                        item.transaction_id?.toLowerCase().includes(donationSearchTerm.toLowerCase());
                      return matchesCategory && matchesSearch;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                          {item.transaction_id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{item.donor_name}</p>
                          <p className="text-xs text-slate-500">{item.donor_email}</p>
                          {item.donor_phone && <p className="text-[11px] text-slate-400">{item.donor_phone}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">
                          {item.payment_method || 'Online Gateway'}
                        </td>
                        <td className="px-6 py-4 font-heading font-extrabold text-base text-emerald-600">
                          ₹{Number(item.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}

                  {donations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                        No giving transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'livestream' ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Control Panel Card */}
          <Card className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">📹</span> YouTube Live Stream Control
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Manage live stream broadcasts on your website in real-time.
                </p>
              </div>

              {/* Instant Toggle Button */}
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  liveStreamSettings.is_live
                    ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {liveStreamSettings.is_live ? "🔴 CURRENTLY LIVE" : "⚪ OFFLINE"}
                </span>

                <Button
                  onClick={() => handleSaveLiveStream(!liveStreamSettings.is_live)}
                  disabled={liveStreamSaving}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                    liveStreamSettings.is_live
                      ? "bg-slate-900 hover:bg-slate-800 text-white"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                >
                  {liveStreamSaving
                    ? "Updating..."
                    : liveStreamSettings.is_live
                    ? "⏹ END LIVE BROADCAST"
                    : "🔴 GO LIVE NOW"}
                </Button>
              </div>
            </div>

            {/* Notification message */}
            {liveStreamMsg && (
              <div className={`mt-4 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                liveStreamMsg.includes("LIVE NOW") || liveStreamMsg.includes("successfully")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}>
                <span>ℹ️</span> {liveStreamMsg}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5 mt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  YouTube Live Stream Video URL / Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                  value={liveStreamSettings.video_url || ""}
                  onChange={(e) => setLiveStreamSettings({ ...liveStreamSettings, video_url: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Paste any YouTube live video URL or Video ID. The system automatically parses the video player embed format.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Live Stream Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunday Morning Worship & Divine Word"
                  value={liveStreamSettings.stream_title || ""}
                  onChange={(e) => setLiveStreamSettings({ ...liveStreamSettings, stream_title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Stream Description / Notice
                </label>
                <textarea
                  rows={3}
                  placeholder="Welcome to today's live service..."
                  value={liveStreamSettings.stream_description || ""}
                  onChange={(e) => setLiveStreamSettings({ ...liveStreamSettings, stream_description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <Button
                  onClick={() => handleSaveLiveStream()}
                  disabled={liveStreamSaving}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  Save Settings
                </Button>

                <Button
                  onClick={handleArchiveLiveStreamToSermons}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-5 py-2.5 rounded-xl text-sm"
                >
                  📥 Archive Stream to Sermons Library
                </Button>
              </div>
            </div>
          </Card>

          {/* Admin Embedded Preview Card */}
          {liveStreamSettings.video_url && (
            <Card className="p-6 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
              <h3 className="text-lg font-bold mb-3 text-slate-200 flex items-center gap-2">
                <span>👁️</span> Live Video Stream Preview (Admin View)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                This is how the video player will render on the main website home page when broadcasting live.
              </p>
              
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                {liveStreamSettings.video_id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${liveStreamSettings.video_id}?autoplay=0`}
                    title="Live Stream Preview"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                    Enter a valid YouTube URL to see player preview
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      ) : null}

    </div>
  );
};

export default AdminDashboard;