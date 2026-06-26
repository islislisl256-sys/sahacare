'use client';

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, User, DollarSign, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";

export default function RequestDetailsAndOffersPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [reqDetails, setReqDetails] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Negotiation Modal State
  const [negotiateOfferId, setNegotiateOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [submittingCounter, setSubmittingCounter] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Fetch Request
      const reqRes = await fetch(`/api/requests/${id}`, { cache: 'no-store' });
      if (!reqRes.ok) throw new Error("Failed to fetch request details");
      const reqData = await reqRes.json();
      setReqDetails(reqData.data);

      // 2. Fetch Offers for this request
      const offersRes = await fetch(`/api/offers?requestId=${id}`, { cache: 'no-store' });
      if (!offersRes.ok) throw new Error("Failed to fetch offers");
      const offersData = await offersRes.json();
      setOffers(offersData.data || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAcceptOffer = async (offerId: string) => {
    setAcceptingId(offerId);
    try {
      const res = await fetch("/api/offers/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to accept offer");
      }

      // If success, navigate to the treatment page where they can call the provider
      window.location.href = `/dashboard/treatments/${id}`;
    } catch (err: any) {
      console.error(err);
      alert("حدث خطأ: " + err.message);
      setAcceptingId(null);
    }
  };

  const handleCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!negotiateOfferId || !counterPrice) return;
    setSubmittingCounter(true);
    try {
      const res = await fetch("/api/offers/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: negotiateOfferId,
          price: parseFloat(counterPrice),
          message: counterMessage,
        })
      });
      if (!res.ok) throw new Error("Failed to submit counter offer");
      
      setNegotiateOfferId(null);
      setCounterPrice("");
      setCounterMessage("");
      fetchData(); // Refresh the list
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setSubmittingCounter(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">جاري التحميل...</p>
      </div>
    );
  }

  if (errorMsg || !reqDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-xl font-bold text-slate-800 dark:text-white mb-4">{errorMsg || "الطلب غير موجود"}</p>
        <button onClick={() => router.push('/dashboard/my-requests')} className="text-red-600 font-bold hover:underline">
          العودة للطلبات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push('/dashboard/my-requests')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">تفاصيل الطلب والعروض</h1>
      </div>

      {/* Request Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">معلومات الطلب</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">نوع الخدمة: </span>
            {reqDetails.service_type}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">الحالة: </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              reqDetails.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
              reqDetails.status === 'accepted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
              'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
            }`}>
              {reqDetails.status === 'pending' ? 'قيد الانتظار' : reqDetails.status === 'accepted' ? 'قيد التنفيذ' : reqDetails.status}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">الوصف: </span>
            <p className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-700">
              {reqDetails.description || "لا يوجد وصف."}
            </p>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">العروض المقدمة ({offers.length})</h2>
        
        {offers.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">لا توجد عروض بعد</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">سيقوم المعالجون بتقديم عروضهم قريباً.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-sm">
                    {offer.provider?.avatar_url ? (
                      <img src={offer.provider.avatar_url} alt={offer.provider.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white hover:text-red-600 transition-colors cursor-pointer" onClick={() => router.push(`/provider-profile/${offer.provider_id}`)}>
                      {offer.provider?.name || "معالج غير معروف"}
                    </h3>
                    {offer.message && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{offer.message}"</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-xl bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl border border-red-100 dark:border-red-500/20">
                    <DollarSign className="w-5 h-5" />
                    {offer.price} د.ج
                  </div>
                  
                  {reqDetails.status === 'pending' && offer.status !== 'countered_by_patient' && (
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        disabled={acceptingId !== null}
                        className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {acceptingId === offer.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                        قبول العرض
                      </button>
                      <button
                        onClick={() => setNegotiateOfferId(offer.id)}
                        className="w-full md:w-auto px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-200 dark:shadow-none hover:bg-amber-600 transition-colors flex items-center justify-center"
                      >
                        تفاوض
                      </button>
                    </div>
                  )}
                  {offer.status === 'countered_by_patient' && (
                    <div className="text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-500/20 w-full text-center">
                      في انتظار رد المعالج...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Negotiation Modal */}
      {negotiateOfferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">اقتراح سعر جديد</h3>
            <form onSubmit={handleCounterOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السعر المقترح (دج)</label>
                <input 
                  type="number" 
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  placeholder="أدخل السعر الجديد" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:text-white transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رسالة (اختياري)</label>
                <textarea 
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  rows={3}
                  placeholder="أضف رسالة للمعالج..." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:text-white resize-none transition-colors"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setNegotiateOfferId(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={submittingCounter}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submittingCounter ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال الاقتراح"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
