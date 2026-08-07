
import { useState } from "react";
import { Pencil, Trash2, Plus, Video, User, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for UI demonstration
const mockSermons = [
    {
        id: 1,
        title: "Walking in Faith: Trusting God's Plan for Your Life",
        preacher: "Pastor Samuel Thomas",
        youtubeUrl: "https://youtube.com/watch?v=example1",
    },
    {
        id: 2,
        title: "The Power of Prayer in the Believer's Life",
        preacher: "Pastor Samuel Thomas",
        youtubeUrl: "https://youtube.com/watch?v=example2",
    },
    {
        id: 3,
        title: "Living a Spirit-Filled Life",
        preacher: "Elder Jacob Mathew",
        youtubeUrl: "https://youtube.com/watch?v=example3",
    },
    {
        id: 4,
        title: "Grace Upon Grace: Understanding God's Unmerited Favor",
        preacher: "Pastor Samuel Thomas",
        youtubeUrl: "https://youtube.com/watch?v=example4",
    },
];

const Admin = () => {
    const [sermons, setSermons] = useState(mockSermons);
    const [formData, setFormData] = useState({
        title: "",
        preacher: "",
        youtubeUrl: "",
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddSermon = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.preacher || !formData.youtubeUrl) return;

        const newSermon = {
            id: sermons.length + 1,
            ...formData,
        };

        setSermons([newSermon, ...sermons]);
        setFormData({ title: "", preacher: "", youtubeUrl: "" });
    };

    const handleDeleteSermon = (id) => {
        setSermons(sermons.filter(sermon => sermon.id !== id));
    };

    return (
        <div className="min-h-screen bg-muted">
            {/* Header */}
            <header className="bg-primary text-primary-foreground py-6">
                <div className="church-container">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold">
                        Admin Dashboard
                    </h1>
                    <p className="text-primary-foreground/80 mt-1">
                        Manage sermons and church content
                    </p>
                </div>
            </header>

            <div className="church-container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Sermon Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg shadow-card p-6 sticky top-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-church-gold/20 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-church-gold" />
                                </div>
                                <h2 className="font-heading text-xl font-semibold text-foreground">
                                    Add New Sermon
                                </h2>
                            </div>

                            <form onSubmit={handleAddSermon} className="space-y-5">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Video className="w-4 h-4 text-muted-foreground" />
                                        Sermon Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter sermon title"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                {/* Preacher Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        Preacher Name
                                    </label>
                                    <input
                                        type="text"
                                        name="preacher"
                                        value={formData.preacher}
                                        onChange={handleInputChange}
                                        placeholder="Enter preacher name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                {/* YouTube URL Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                        YouTube URL
                                    </label>
                                    <input
                                        type="url"
                                        name="youtubeUrl"
                                        value={formData.youtubeUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <Button type="submit" variant="church" size="lg" className="w-full mt-2">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Sermon
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Sermons List */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-lg shadow-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="font-heading text-xl font-semibold text-foreground">
                                    Existing Sermons
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {sermons.length} sermons in the database
                                </p>
                            </div>

                            {/* Sermon Items */}
                            <div className="divide-y divide-border">
                                {sermons.map((sermon) => (
                                    <div
                                        key={sermon.id}
                                        className="px-6 py-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-foreground line-clamp-1">
                                                    {sermon.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3.5 h-3.5" />
                                                        {sermon.preacher}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <LinkIcon className="w-3.5 h-3.5" />
                                                        <a
                                                            href={sermon.youtubeUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline truncate max-w-[200px]"
                                                        >
                                                            {sermon.youtubeUrl}
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteSermon(sermon.id)}
                                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State (hidden when there are sermons) */}
                            {sermons.length === 0 && (
                                <div className="px-6 py-12 text-center">
                                    <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        No sermons added yet. Use the form to add your first sermon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
