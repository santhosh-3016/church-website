import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/PageHero";
import {
  Heart,
  CreditCard,
  Gift,
  Building,
  Globe,
  CheckCircle,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  HelpCircle,
  DollarSign,
  Lock,
  QrCode,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const givingCategories = [
  {
    id: "tithe",
    title: "Sunday Tithe",
    description: "Honoring God with the first tenth of our income (Malachi 3:10).",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 text-rose-600",
    badge: "10% First Fruits"
  },
  {
    id: "offering",
    title: "General Offering",
    description: "Supporting daily church operations, worship services & ministries.",
    icon: Gift,
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50 text-sky-600",
    badge: "Freewill Offering"
  },
  {
    id: "building",
    title: "Building & Facility Fund",
    description: "Expanding church sanctuary, infrastructure & media equipment.",
    icon: Building,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 text-amber-600",
    badge: "Church Growth"
  },
  {
    id: "missions",
    title: "Missions & Charity",
    description: "Supporting community outreach, poor relief & mission work.",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 text-emerald-600",
    badge: "Outreach & Hope"
  }
];

const presetAmounts = [500, 1000, 2500, 5000, 10000];

export default function Give() {
  const [selectedCategory, setSelectedCategory] = useState("tithe");
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Modals state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI / Online");

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
  };

  const handleAmountSelect = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleVerifyRazorpayPayment = async (rzpResponse, orderData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/donations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: rzpResponse.razorpay_order_id,
          razorpay_payment_id: rzpResponse.razorpay_payment_id,
          razorpay_signature: rzpResponse.razorpay_signature,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          amount: effectiveAmount,
          category: orderData.category,
          payment_method: "Razorpay (UPI / Cards / NetBanking)",
          notes: notes
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.receipt) {
        setReceiptData(data.receipt);
        setShowReceiptModal(true);
      } else {
        alert(data.message || "Payment signature verification failed.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Live payment verification error:", err);
      alert("Failed to connect to backend server for verification.");
    }
  };

  const handleInitiateGiving = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!donorName.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }
    if (!donorEmail.trim() || !donorEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address for receipt delivery");
      return;
    }
    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMsg("Please select or enter a valid donation amount");
      return;
    }

    setLoading(true);

    try {
      const selectedCatObj = givingCategories.find(c => c.id === selectedCategory);
      const res = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          category: selectedCatObj ? selectedCatObj.title : "General Offering",
          donor_name: donorName,
          donor_email: donorEmail
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.order_id && data.key_id) {
          // Live Razorpay Mode
          const resScript = await loadRazorpayScript();
          if (!resScript) {
            setErrorMsg("Razorpay SDK failed to load. Please check your internet connection.");
            return;
          }

          const options = {
            key: data.key_id,
            amount: data.amount * 100,
            currency: data.currency || "INR",
            name: "Power Of Praise A.G Church",
            description: `${selectedCatObj ? selectedCatObj.title : 'General Offering'} Offering`,
            image: "/church-logo.jpg",
            order_id: data.order_id,
            prefill: {
              name: donorName,
              email: donorEmail,
              contact: donorPhone
            },
            theme: { color: "#0B1B3D" },
            handler: async function (response) {
              await handleVerifyRazorpayPayment(response, data);
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Test Simulation Mode
          setActiveOrder(data);
          setShowCheckoutModal(true);
        }
      } else {
        setErrorMsg(data.message || "Could not initiate transaction. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Giving initiate error:", err);
      setErrorMsg("Failed to connect to backend server. Make sure backend is running.");
    }
  };

  const handleCompletePayment = async () => {
    if (!activeOrder) return;
    setLoading(true);

    try {
      const res = await fetch("/api/donations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: activeOrder.transaction_id,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          amount: effectiveAmount,
          category: activeOrder.category,
          payment_method: paymentMethod,
          notes: notes
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.receipt) {
        setShowCheckoutModal(false);
        setReceiptData(data.receipt);
        setShowReceiptModal(true);
      } else {
        alert(data.message || "Payment verification failed.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Payment verify error:", err);
      alert("Error processing payment connection.");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <Layout>
      <PageHero
        title="ONLINE GIVING & OFFERING"
        subtitle="Honor the Lord with your wealth, with the firstfruits of all your crops — Proverbs 3:9"
        breadcrumbs={[{ label: "Giving", path: "/give" }]}
      />

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          
          {/* Spiritual Card Banner */}
          <div className="bg-gradient-to-r from-[#0B1B3D] via-sky-900 to-[#0B1B3D] rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden mb-12 border border-sky-800">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-4 border border-sky-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Generous Giving
              </span>
              <h2 className="text-2xl md:text-4xl font-heading font-extrabold tracking-tight text-white mb-3">
                Partner with God's Work at Power of Praise Church
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Your generous giving enables us to preach the Gospel, support families in need, equip future leaders, and build God's house. Every contribution makes a lasting spiritual impact.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Columns: Step 1 Category & Step 2 Amount */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Category Selector */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Step 1</span>
                    <h3 className="text-xl font-bold text-[#0B1B3D]">Select Giving Category</h3>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {givingCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative ${
                          isSelected
                            ? "border-sky-600 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-lg shrink-0 ${cat.bgColor}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 mb-1">
                              {cat.badge}
                            </span>
                            <h4 className="font-bold text-sm text-[#0B1B3D]">{cat.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">{cat.description}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 text-sky-600">
                            <CheckCircle className="w-5 h-5 fill-sky-600 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amount Selector */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="mb-6">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Step 2</span>
                  <h3 className="text-xl font-bold text-[#0B1B3D]">Choose Giving Amount (₹)</h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-5">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountSelect(val)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                        amount === val && !customAmount
                          ? "bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-md scale-[1.02]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Donor Information & Checkout Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-200 sticky top-28">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Step 3</span>
                  <h3 className="text-xl font-bold text-[#0B1B3D]">Donor Details</h3>
                </div>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleInitiateGiving} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brother John Mark"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Note / Prayer Request (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add a note or prayer request..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Order Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Category:</span>
                      <span className="font-bold text-slate-800">
                        {givingCategories.find(c => c.id === selectedCategory)?.title}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Giving Amount:</span>
                      <span className="font-bold text-slate-800">₹{effectiveAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 text-sm">Total Contribution:</span>
                      <span className="font-heading text-lg font-extrabold text-sky-700">
                        ₹{effectiveAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 rounded-xl bg-[#0B1B3D] hover:bg-sky-900 text-white font-bold text-base shadow-lg shadow-sky-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Initiating Payment...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-sky-400" />
                        Proceed to Give ₹{effectiveAmount.toLocaleString('en-IN')}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>256-bit SSL Encrypted & Secure Payment</span>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* FAQs Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-600" />
              Frequently Asked Questions About Online Giving
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Is online giving safe and secure?</h4>
                <p>Yes. All transactions are processed through encrypted 256-bit SSL connections. We do not store any sensitive card or banking credentials on our servers.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Will I get an official receipt for my donation?</h4>
                <p>Immediately after a successful payment, an official digital receipt will be generated on screen for download and sent directly to your email address.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">What payment options are supported?</h4>
                <p>We support all major payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard), and Internet Banking.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Can I give for a specific ministry or event?</h4>
                <p>Yes! Simply select the appropriate category (Sunday Tithe, General Offering, Building Fund, or Missions) and add a note in the prayer/note box.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------- PAYMENT CHECKOUT MODAL -------------------- */}
      {showCheckoutModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B1B3D] to-sky-900 text-white p-6 relative">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Lock className="w-3.5 h-3.5" /> Secure Payment Checkout
              </div>
              <h3 className="text-xl font-bold">Complete Your Offering</h3>
              <p className="text-slate-300 text-xs mt-1">Power of Praise A.G Church</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Transaction Summary Card */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">{activeOrder.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-800">{activeOrder.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-bold text-slate-800">{donorName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sky-200 text-sm">
                  <span className="font-bold text-slate-700">Amount Due:</span>
                  <span className="font-heading font-extrabold text-sky-700 text-base">
                    ₹{effectiveAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI / Online")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === "UPI / Online"
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-sky-600" />
                    UPI / GPay / PhonePe
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Credit / Debit Card")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === "Credit / Debit Card"
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    Card / Net Banking
                  </button>
                </div>
              </div>

              {/* Test Mode Notification Box */}
              {activeOrder.is_test_mode && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <span className="font-bold">⚡ Test Simulation Mode Enabled:</span> Click below to test instant payment execution and verify receipt & database recording.
                </div>
              )}

              <Button
                onClick={handleCompletePayment}
                disabled={loading}
                className="w-full py-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Pay ₹{effectiveAmount.toLocaleString('en-IN')} Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DIGITAL RECEIPT MODAL -------------------- */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 print:shadow-none print:border-none print:max-w-none">
            
            {/* Official Church Receipt Design */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Receipt Header */}
              <div className="text-center border-b border-slate-200 pb-6 relative">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="absolute top-0 right-0 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 print:hidden"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle className="w-7 h-7" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-1">
                  Payment Successful
                </span>
                
                <h3 className="text-lg font-extrabold text-[#0B1B3D] tracking-tight">
                  POWER OF PRAISE A.G CHURCH
                </h3>
                <p className="text-xs text-slate-500 font-medium">Official Digital Giving Receipt</p>
              </div>

              {/* Receipt Details Grid */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-mono font-bold text-slate-800">{receiptData.receipt_no}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Ref ID:</span>
                  <span className="font-mono font-bold text-slate-800">{receiptData.transaction_id}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-bold text-slate-800">{receiptData.donor_name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donor Email:</span>
                  <span className="font-bold text-slate-800">{receiptData.donor_email}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-800">{receiptData.category}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-bold text-slate-800">{receiptData.payment_method}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(receiptData.date).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Amount Highlight */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">
                    Amount Received
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-sky-700">
                    ₹{receiptData.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Thank You Note */}
              <div className="text-center text-xs text-slate-500 italic bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                "God bless you richly for your sacrificial giving and commitment to His kingdom!"
              </div>

              {/* Print Action Buttons */}
              <div className="flex items-center gap-3 pt-2 print:hidden">
                <Button
                  onClick={handlePrintReceipt}
                  variant="outline"
                  className="flex-1 py-5 rounded-xl border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  Print Receipt
                </Button>

                <Button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 py-5 rounded-xl bg-[#0B1B3D] hover:bg-sky-900 text-white font-bold text-xs"
                >
                  Done
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
