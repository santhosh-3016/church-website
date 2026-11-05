
import { useState } from 'react';
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Check, AlertCircle } from "lucide-react";

const AppointmentBooking = () => {
    const [activeTab, setActiveTab] = useState('book'); // 'book' or 'status'

    // Booking Form State
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', topic: '', message: '', day: '', slot: ''
    });
    const [status, setStatus] = useState({ type: '', message: '', whatsappLink: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Status Check State
    const [checkPhone, setCheckPhone] = useState('');
    const [myAppointments, setMyAppointments] = useState([]);
    const [checkStatusMsg, setCheckStatusMsg] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    // Dynamic dates generation (Next 30 days, all days allowed)
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 1; i <= 30; i++) { // Check next 30 days
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);

            const dateString = nextDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
            }); // e.g., "Oct 12"

            dates.push({ value: dateString });

            if (dates.length >= 10) break; // Limit to 10 options
        }
        return dates;
    };

    const availableDates = getAvailableDates();

    // Dynamic slots based on day name logic
    // Dynamic slots (simplified for now as all days have same slots)
    const getSlotsForDay = (dateString) => {
        if (!dateString) return [];

        return [
            '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM',
            '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM',
            '04:00 PM - 04:30 PM', '04:30 PM - 05:00 PM'
        ];
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '', whatsappLink: '' });

        // Auto-correct common email typos (e.g. gamil.com -> gmail.com)
        const cleanedEmail = formData.email
            ? formData.email.trim().replace(/@gamil\.com$/i, '@gmail.com').replace(/@gmai\.com$/i, '@gmail.com').replace(/@gmial\.com$/i, '@gmail.com')
            : '';

        const payload = { ...formData, email: cleanedEmail };

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: 'error', message: data.message || 'Booking failed', whatsappLink: '' });
            } else {
                setStatus({
                    type: 'success',
                    message: 'Appointment request submitted successfully! An email confirmation has been sent.',
                    whatsappLink: data.whatsapp_admin_link || ''
                });
                setFormData({ name: '', phone: '', email: '', topic: '', message: '', day: '', slot: '' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Server connection failed. Try again later.', whatsappLink: '' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setIsChecking(true);
        setCheckStatusMsg('');
        setMyAppointments([]);

        try {
            const res = await fetch('/api/appointments/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: checkPhone })
            });
            const data = await res.json();

            if (data.length === 0) {
                setCheckStatusMsg('No appointments found for this phone number.');
            } else {
                setMyAppointments(data);
            }
        } catch (err) {
            setCheckStatusMsg('Error checking status.');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <Layout>
            <PageHero
                badge="Prayer & Counseling"
                badgeIcon={Calendar}
                title="Pastoral Appointment"
                subtitle="Request a time for prayer, counseling, and spiritual guidance with our pastor."
            />

            <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
                <div className="absolute top-20 right-10 w-72 h-72 bg-church-lightblue/5 rounded-full blur-3xl"></div>

                <div className="church-container max-w-4xl relative z-10">
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8 md:mb-12">
                        <div className="bg-muted p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => setActiveTab('book')}
                                className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'book' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Book Appointment
                            </button>
                            <button
                                onClick={() => setActiveTab('status')}
                                className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'status' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Check Status
                            </button>
                        </div>
                    </div>

                    {activeTab === 'book' ? (
                        <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-border/30 border-t-4 border-t-church-gold">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Full Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Phone Number *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all" placeholder="+91 99999 99999" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Email Address (Optional)</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Prayer Topic *</label>
                                    <select name="topic" value={formData.topic} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all">
                                        <option value="">Select a Topic</option>
                                        <option value="Prayer Request">General Prayer</option>
                                        <option value="Counseling">Counseling</option>
                                        <option value="Family Issues">Family Matter</option>
                                        <option value="Spiritual Guidance">Spiritual Guidance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-church-gold" />
                                            Preferred Day *
                                        </label>
                                        <select name="day" value={formData.day} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                                            <option value="">Select Date</option>
                                            {availableDates.map((dateObj, index) => (
                                                <option key={index} value={dateObj.value}>{dateObj.value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-church-gold" />
                                            Time Slot *
                                        </label>
                                        <select name="slot" value={formData.slot} onChange={handleChange} required disabled={!formData.day} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50">
                                            <option value="">Select Time</option>
                                            {formData.day && getSlotsForDay(formData.day).map((slot, index) => (
                                                <option key={index} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Message (Optional)</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder="Any specific details..."></textarea>
                                </div>

                                {status.message && (
                                    <div className="space-y-3">
                                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                                            {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
                                            <p className="text-sm font-medium">{status.message}</p>
                                        </div>

                                        {status.type === 'success' && status.whatsappLink && (
                                            <a
                                                href={status.whatsappLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md"
                                            >
                                                💬 Send Request via WhatsApp to Church (+91 9025937253)
                                            </a>
                                        )}
                                    </div>
                                )}

                                <Button type="submit" variant="church" size="lg" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Request Appointment'}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-border/30 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 border-b border-border pb-4">Check Request Status</h2>
                            <form onSubmit={handleCheckStatus} className="space-y-4 mb-8">
                                <label className="text-sm font-medium text-foreground">Enter Phone Number used for Booking:</label>
                                <div className="flex gap-4">
                                    <input
                                        type="tel"
                                        value={checkPhone}
                                        onChange={(e) => setCheckPhone(e.target.value)}
                                        required
                                        className="flex-grow px-4 py-3 border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="+91..."
                                    />
                                    <Button type="submit" variant="church" disabled={isChecking}>
                                        {isChecking ? 'Checking...' : 'Check Status'}
                                    </Button>
                                </div>
                            </form>

                            {checkStatusMsg && (
                                <div className="text-center text-muted-foreground italic mb-6 bg-muted/50 p-4 rounded-lg">
                                    {checkStatusMsg}
                                </div>
                            )}

                            {myAppointments.length > 0 && (
                                <div className="space-y-4">
                                    {myAppointments.map((apt) => (
                                        <div key={apt.id} className="bg-muted/30 p-5 rounded-lg border border-border hover:border-primary/30 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-lg text-primary">{apt.topic}</h3>
                                                    <p className="text-sm text-foreground/70 flex items-center gap-2 mt-1">
                                                        <Calendar className="w-3.5 h-3.5" /> {apt.day}
                                                        <span className="text-border">|</span>
                                                        <Clock className="w-3.5 h-3.5" /> {apt.slot}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${apt.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        apt.status === 'reschedule' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                            {apt.admin_response && (
                                                <div className="mt-3 bg-background p-4 rounded-md border border-border/60 text-sm">
                                                    <span className="font-semibold text-foreground/80 block mb-1">Pastor's Response:</span>
                                                    <p className="text-muted-foreground italic">"{apt.admin_response}"</p>
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-3 text-right">Requested on: {new Date(apt.created_at).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default AppointmentBooking;
