'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Megaphone, Hourglass, DollarSign, MapPin, Clock, FileText, Loader2, X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProviderDashboard() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Offer Modal State
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Translations for service types
  const SERVICE_LABELS: Record<string, string> = {
    "physical-therapy": t("service_physical_therapy") || "علاج طبيعي",
    "psychiatry": t("service_psychiatry") || "طبيب نفسي",
    "pediatrics": t("service_pediatrics") || "طبيب أطفال",
    "lab-tests": t("service_lab_tests") || "تحاليل طبية",
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
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
      }, 2000);
      
    } catch (err: any) {
      setOfferError(err.message || "حدث خطأ");
    } finally {
      setSubmittingOffer(false);
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
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">0</p>
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
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t("job_board")}</h3>
          <div className="flex gap-2">
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
              <option>{t("filter_by_distance")}</option>
              <option>{t("less_than_5km")}</option>
              <option>{t("less_than_15km")}</option>
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
                  <button onClick={() => setSelectedReqId(req.id)} className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
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
    </div>
  );
}
