'use client';

import { useParams, useRouter } from "next/navigation";
import { User, Activity, FileText, Calendar, Clock, ChevronRight, Download, Brain, Baby, TestTube2, Image as ImageIcon, Star, MessageSquare } from "lucide-react";
import React from "react";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "physical-therapy": <Activity className="w-6 h-6" />,
  "psychiatry": <Brain className="w-6 h-6" />,
  "pediatrics": <Baby className="w-6 h-6" />,
  "lab-tests": <TestTube2 className="w-6 h-6" />,
};

// Mock data
const MOCK_TREATMENTS: Record<string, any> = {
  "2": {
    type: "lab-tests",
    title: "تحاليل طبية",
    date: "2026-06-10",
    time: "09:00",
    patientName: "فاطمة الزهراء",
    report: "تم إجراء تحليل صورة دم كاملة (CBC) وتحليل سكر صائم. المؤشرات الحيوية طبيعية، نقص طفيف في فيتامين د.",
    notes: "يُرجى عرض النتيجة على الطبيب المختص لوصف المكمل الغذائي المناسب.",
    hasImage: true,
    imageUrl: "/lab_result.png",
    rating: 5,
    feedback: "طاقم المختبر كان محترفاً جداً والنتائج ظهرت في وقت قياسي. شكراً لكم!"
  }
};

export default function ProviderTreatmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  // Defaulting to 2 just for the mock presentation if they click on patient 2
  const treatment = MOCK_TREATMENTS[id] || MOCK_TREATMENTS["2"];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="hover:text-teal-600 cursor-pointer transition-colors" onClick={() => router.push('/provider/patients')}>المرضى</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium">تقرير العلاج المكتمل</span>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              {SERVICE_ICONS[treatment.type] || <Activity className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{treatment.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {treatment.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {treatment.time}</span>
              </div>
            </div>
          </div>
          <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold">
            مكتمل
          </span>
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-500" /> معلومات المريض
        </h3>
        <p className="font-medium text-slate-900 dark:text-white text-lg">{treatment.patientName}</p>
      </div>

      {/* Patient Rating & Feedback */}
      {(treatment.rating || treatment.feedback) && (
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm transition-colors">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> رأي المريض بالخدمة
          </h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-5 h-5 ${star <= treatment.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
            ))}
          </div>
          {treatment.feedback && (
            <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 italic">
              "{treatment.feedback}"
            </p>
          )}
        </div>
      )}

      {/* Medical Report Submitted */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
          <FileText className="w-6 h-6 text-teal-500" /> التقرير الطبي الذي أضفته
        </h3>
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">التشخيص والتفاصيل</h4>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base">{treatment.report}</p>
          </div>
          {treatment.notes && (
            <div className="bg-amber-50 dark:bg-amber-500/5 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/10">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-2">ملاحظات هامة / توصيات</h4>
              <p className="text-amber-900 dark:text-amber-200 leading-relaxed text-base">{treatment.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Attachments */}
      {treatment.hasImage && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
              <ImageIcon className="w-6 h-6 text-blue-500" /> المرفقات
            </h3>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img 
              src={treatment.imageUrl} 
              alt="مرفق" 
              className="w-full h-auto max-h-[600px] object-cover hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in"
            />
          </div>
        </div>
      )}
    </div>
  );
}
