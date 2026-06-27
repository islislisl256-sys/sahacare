'use client';

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, User, Phone, MapPin, Calendar, CheckCircle2, AlertCircle, FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProviderCasesPage() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Report submission state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeAppt, setActiveAppt] = useState<any>(null);
  const [reportNotes, setReportNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchCases();
    }
  }, [session]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?providerId=${(session?.user as any).id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("فشل في جلب الحالات");
      const data = await res.json();
      setAppointments(data.data || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReport = (appt: any) => {
    setActiveAppt(appt);
    setReportNotes("");
    setReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportNotes.trim()) {
      alert("الرجاء كتابة تفاصيل التقرير");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: activeAppt.id,
          patientId: activeAppt.patient_id,
          notes: reportNotes
        })
      });

      if (!res.ok) throw new Error("فشل في إرسال التقرير");
      
      alert("تم إرسال التقرير وإنهاء الحالة بنجاح!");
      setReportModalOpen(false);
      fetchCases(); // refresh
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">المرضى الحاليين</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">إدارة مرضاك والتواصل معهم وإنهاء تقاريرهم</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">لا توجد حالات حالية</h3>
          <p className="text-slate-500 dark:text-slate-400">عندما يوافق مريض على أحد عروضك، سيظهر هنا.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              قائمة المرضى الحاليين
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 gap-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-md transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {appt.patient?.avatar_url ? (
                      <img src={appt.patient.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{appt.patient?.name || "مريض غير معروف"}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(appt.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  appt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {appt.status === 'completed' ? 'منتهية' : 'قيد التنفيذ'}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-4 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تفاصيل الخدمة: {appt.request?.service_type}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line mb-3">
                  {appt.request?.description}
                </p>
                {appt.request?.address_text && (
                  <p className="text-sm text-slate-500 flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {appt.request.address_text}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={`tel:${appt.patient?.phone || ''}`}
                  onClick={(e) => {
                    if (appt.patient?.phone) {
                      navigator.clipboard.writeText(appt.patient.phone);
                      setCopiedPhoneId(appt.id);
                      setTimeout(() => setCopiedPhoneId(null), 2000);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  {copiedPhoneId === appt.id ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-500" /> <span className="text-green-600 dark:text-green-400">تم النسخ ✔</span></>
                  ) : (
                    <><Phone className="w-4 h-4" /> اتصال</>
                  )}
                </a>
                
                {appt.status !== 'completed' ? (
                  <button
                    onClick={() => handleOpenReport(appt)}
                    className="flex-1 flex items-center justify-center gap-2 bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" /> إنهاء التقرير
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2.5 rounded-xl font-bold border border-green-100">
                    <CheckCircle2 className="w-4 h-4" /> التقرير مُرسل
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && activeAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-500" />
              كتابة التقرير الطبي
            </h2>
            
            <p className="text-sm text-slate-500 mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              للمريض: <strong className="text-slate-800 dark:text-white">{activeAppt.patient?.name}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تفاصيل التشخيص والعلاج</label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-teal-500 text-slate-900 dark:text-white resize-none"
                  placeholder="قم بكتابة التشخيص، الأدوية الموصوفة، أو أي ملاحظات هامة للمريض..."
                />
              </div>

              {/* Upload simulated button */}
              <div className="flex items-center gap-3">
                <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Upload className="w-4 h-4" /> إرفاق ملف (قريباً)
                </button>
                <span className="text-xs text-slate-400">سيتم تفعيل رفع الملفات لاحقاً</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setReportModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSubmitReport}
                disabled={submitting}
                className="px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-200 dark:shadow-none hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                إرسال وإغلاق الحالة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
