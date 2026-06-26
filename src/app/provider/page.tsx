'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Megaphone, Hourglass, DollarSign, MapPin, Clock, FileText, Loader2, X, CheckCircle2, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [distance, setDistance] = useState(20); // Add distance state
  
  // Offer Modal State
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState(false);
  
  // Accept Request State
  const [acceptingReqId, setAcceptingReqId] = useState<string | null>(null);

  // Counter Offer Modal State
  const [counterOfferId, setCounterOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [submittingCounter, setSubmittingCounter] = useState(false);

  // Translations for service types
  const SERVICE_LABELS: Record<string, string> = {
    "physical-therapy": t("service_physical_therapy") || "علاج طبيعي",
    "psychiatry": t("service_psychiatry") || "طبيب نفسي",
    "pediatrics": t("service_pediatrics") || "طبيب أطفال",
    "lab-tests": t("service_lab_tests") || "تحاليل طبية",
  };

  useEffect(() => {
    fetchRequests();
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/offers", { cache: 'no-store' });
      const json = await res.json();
      if (json.data) {
        // Filter out accepted/rejected to only show active negotiations
        setActiveOffers(json.data.filter((o: any) => o.status !== 'rejected' && o.status !== 'accepted'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOffers(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests", { cache: 'no-store' });
      const json = await res.json();
      if (json.data) {
        setRequests(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId || !offerPrice) return;
    
    setSubmittingOffer(true);
    setOfferError("");
    
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedReqId,
          price: parseFloat(offerPrice),
          message: offerMessage
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل في إرسال العرض");
      }
      
      setOfferSuccess(true);
      setTimeout(() => {
        setOfferSuccess(false);
        setSelectedReqId(null);
        setOfferPrice("");
        setOfferMessage("");
        fetchRequests(); // Refresh the list
        fetchOffers();
      }, 2000);
      
    } catch (err: any) {
      setOfferError(err.message || "حدث خطأ");
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setAcceptingReqId(requestId);
    try {
      const res = await fetch("/api/requests/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل في قبول الطلب");
      }
      window.location.href = '/provider/patients';
    } catch (err: any) {
      alert(err.message || "حدث خطأ");
    } finally {
      setAcceptingReqId(null);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const res = await fetch("/api/offers/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId }),
      });
      if (!res.ok) throw new Error("فشل في قبول العرض");
      fetchOffers();
      window.location.href = '/provider/patients';
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterOfferId || !counterPrice) return;
    setSubmittingCounter(true);
    try {
      const res = await fetch("/api/offers/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: counterOfferId,
          price: parseFloat(counterPrice),
          message: counterMessage,
        })
      });
      if (!res.ok) throw new Error("فشل إرسال الاقتراح");
      
      setCounterOfferId(null);
      setCounterPrice("");
      setCounterMessage("");
      fetchOffers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingCounter(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t("new_requests_today")}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">{requests.length}</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t("pending_offers")}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">{activeOffers.length}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Hourglass className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t("expected_profits_week")}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">0 <span className="text-base text-slate-500 dark:text-slate-400 font-medium">{t("currency")}</span></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-600" />
            {t("job_board")}
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/provider/patients')}
              className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 transition-colors text-sm"
            >
              المرضى الحاليين
            </button>
            <select
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value={5}>5 كم</option>
              <option value={10}>10 كم</option>
              <option value={20}>20 كم</option>
              <option value={50}>50 كم</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center p-8 text-slate-500 dark:text-slate-400 font-bold text-lg">
              لا توجد طلبات جديدة متاحة حالياً
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-md text-xs font-bold mb-3 border border-teal-100 dark:border-teal-500/20">
                      {t("required")} {SERVICE_LABELS[req.service_type] || req.service_type}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      طلب من: {req.patient?.name || "مريض"}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {req.address_text || "غير محدد"}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(req.created_at).toLocaleTimeString('ar-DZ')}</span>
                    </div>
                  </div>
                  <div className="text-left bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t("patient_budget")}</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{req.budget ? `${req.budget} دج` : t("unspecified")} </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm my-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl leading-relaxed border border-slate-100 dark:border-slate-700 whitespace-pre-line">
                  {req.description || "لا يوجد تفاصيل إضافية."}
                </p>
                <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => handleAcceptRequest(req.id)} 
                    disabled={acceptingReqId === req.id}
                    className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {acceptingReqId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    قبول الطلب مباشرة
                  </button>
                  <button onClick={() => setSelectedReqId(req.id)} className="bg-teal-600 dark:bg-teal-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
                    {t("submit_offer")}
                  </button>
                  {req.prescription_url && (
                    <a href={req.prescription_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                      <FileText className="w-4 h-4" /> {t("view_prescription")}
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Offers & Negotiations */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors mt-8">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-amber-600" />
            عروضي النشطة والمفاوضات
          </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 gap-4">
          {loadingOffers ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>
          ) : activeOffers.length === 0 ? (
            <div className="text-center p-8 text-slate-500 dark:text-slate-400 font-bold text-lg">
              لا توجد عروض نشطة أو مفاوضات حالياً
            </div>
          ) : (
            activeOffers.map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold mb-3 border ${
                      offer.status === 'countered_by_patient' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {offer.status === 'countered_by_patient' ? 'اقتراح سعر جديد من المريض' : 'بانتظار رد المريض'}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      السعر الحالي: {offer.price} دج
                    </h4>
                    {offer.message && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        "{offer.message}"
                      </p>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">وقت التقديم</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {new Date(offer.created_at).toLocaleDateString('ar-DZ')}
                    </p>
                  </div>
                </div>
                
                {offer.status === 'countered_by_patient' && (
                  <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => handleAcceptOffer(offer.id)}
                      className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      قبول السعر
                    </button>
                    <button 
                      onClick={() => setCounterOfferId(offer.id)}
                      className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm"
                    >
                      اقتراح سعر آخر
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offer Submission Modal */}
      {selectedReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">تقديم عرض سعر</h3>
              <button onClick={() => setSelectedReqId(null)} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {offerSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">تم إرسال العرض بنجاح!</h4>
              </div>
            ) : (
              <form onSubmit={submitOffer} className="space-y-4">
                {offerError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{offerError}</div>}
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السعر المقترح (دج)</label>
                  <input 
                    type="number" 
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="مثال: 2500" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رسالة للمريض (اختياري)</label>
                  <textarea 
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    rows={3}
                    placeholder="أضف تفاصيل عن عرضك أو توقيت متاح..." 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white resize-none transition-colors"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={submittingOffer}
                  className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submittingOffer ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال العرض"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Counter Offer Modal */}
      {counterOfferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">تقديم سعر آخر</h3>
              <button onClick={() => setCounterOfferId(null)} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCounterOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السعر المقترح (دج)</label>
                <input 
                  type="number" 
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  placeholder="أدخل السعر الجديد" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 dark:text-white transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رسالة (اختياري)</label>
                <textarea 
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  rows={3}
                  placeholder="أضف رسالة..." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 dark:text-white resize-none transition-colors"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={submittingCounter}
                className="w-full py-3.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submittingCounter ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال الاقتراح"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
