'use client';

import { useParams, useRouter } from "next/navigation";
import { User, Activity, FileText, Calendar, Clock, MapPin, ChevronRight, Download, Brain, Baby, TestTube2, Image as ImageIcon, Star, MessageSquare, Phone, AlertCircle, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "physical-therapy": <Activity className="w-6 h-6" />,
  "psychiatry": <Brain className="w-6 h-6" />,
  "pediatrics": <Baby className="w-6 h-6" />,
  "lab-tests": <TestTube2 className="w-6 h-6" />,
};

export default function TreatmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<any>(null);
  const [record, setRecord] = useState<any>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch appointment details by request_id
      const res = await fetch(`/api/appointments?requestId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch appointment");
      const apptData = await res.json();
      
      if (!apptData.data) {
        throw new Error("لم يتم العثور على موعد لهذا الطلب");
      }
      
      setData(apptData.data);

      // 2. Fetch medical records for this appointment
      const recRes = await fetch(`/api/records?appointmentId=${apptData.data.id}`);
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecord(recData.data || null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">تعذر العثور على البيانات</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4">{errorMsg}</p>
        <button onClick={() => router.push('/dashboard/my-requests')} className="text-red-600 hover:underline font-bold">العودة للطلبات</button>
      </div>
    );
  }

  const { request, provider, patient } = data;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => router.push('/dashboard/my-requests')}>{t("my_requests")}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium">الخدمة: {request?.service_type}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
              {SERVICE_ICONS[request?.service_type] || <Activity className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{request?.service_type}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> تم القبول في {new Date(data.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            record ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'
          } border`}>
            {record ? 'مكتمل' : 'قيد التنفيذ'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" /> المريض
          </h3>
          <p className="font-bold text-slate-900 dark:text-white text-lg">{patient?.name || "غير معروف"}</p>
        </div>

        {/* Provider Details */}
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm transition-colors relative overflow-hidden">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2 relative z-10">
            <Activity className="w-5 h-5 text-indigo-500" /> المعالج
          </h3>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p 
                className="font-bold text-indigo-900 dark:text-white text-lg cursor-pointer hover:underline"
                onClick={() => router.push(`/provider-profile/${data.provider_id}`)}
              >
                {provider?.name || "معالج غير معروف"}
              </p>
              <p className="text-sm text-indigo-600/70 dark:text-indigo-300/70">انقر لعرض الملف الشخصي</p>
            </div>
            
            {provider?.phone && (
              <a 
                href={`tel:${provider.phone}`}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none animate-pulse"
                title="اتصال بالمعالج"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 dark:bg-indigo-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Medical Report */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
          <FileText className="w-6 h-6 text-red-500" /> التقرير الطبي
        </h3>
        
        {!record ? (
          <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-center">
            <FileText className="w-12 h-12 text-amber-300 dark:text-amber-500/50 mx-auto mb-3" />
            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">التقرير لم تتم مشاركته بعد</h4>
            <p className="text-sm text-amber-700/80 dark:text-amber-300/80">سيقوم المعالج برفع التقرير فور الانتهاء من تقديم الخدمة. يرجى التواصل معه إذا لزم الأمر.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">التشخيص والتفاصيل</h4>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base">{record.notes}</p>
            </div>

            {record.file_url && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-blue-500" />
                  <span className="font-bold text-blue-800 dark:text-blue-300">مرفق التقرير</span>
                </div>
                <a href={record.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:shadow-sm transition-shadow">
                  <Download className="w-4 h-4" /> تحميل
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating & Patient Feedback Section (Only if completed) */}
      {record && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors mt-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
            <MessageSquare className="w-6 h-6 text-indigo-500" /> التقييم
          </h3>

          {submittedFeedback ? (
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-6 rounded-2xl text-center">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-2">شكراً لتقييمك!</h4>
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">ما تقييمك لخدمة {provider?.name}؟</label>
                <div className="flex items-center gap-2" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-transparent text-slate-300 dark:text-slate-700 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">ملاحظات إضافية (اختياري)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="كيف كانت تجربتك..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 transition-colors text-slate-900 dark:text-white resize-none"
                />
              </div>

              <button
                onClick={() => setSubmittedFeedback(true)}
                disabled={rating === 0}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إرسال التقييم
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
