'use client';

import { useParams, useRouter } from "next/navigation";
import { User, Activity, FileText, Calendar, Clock, MapPin, ChevronRight, Download, Brain, Baby, TestTube2, Image as ImageIcon } from "lucide-react";
import React from "react";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "physical-therapy": <Activity className="w-6 h-6" />,
  "psychiatry": <Brain className="w-6 h-6" />,
  "pediatrics": <Baby className="w-6 h-6" />,
  "lab-tests": <TestTube2 className="w-6 h-6" />,
};

// Mock data matching the 4 completed requests from MyRequestsPage
const MOCK_TREATMENTS: Record<string, any> = {
  "1": {
    type: "physical-therapy",
    title: "علاج طبيعي",
    date: "2026-06-20",
    time: "10:00",
    providerName: "د. عبد الرحمان طارق",
    providerSpecialty: "أخصائي علاج طبيعي وتأهيل",
    patientName: "أحمد بن فلان",
    report: "المريض أظهر تحسناً ملحوظاً في الحركة بنسبة 30%. تم إجراء تمارين الإطالة والتقوية للعضلة الخلفية. مستوى الألم انخفض من 7/10 إلى 3/10.",
    notes: "يُرجى الاستمرار في تمارين الإطالة المنزلية الموضحة لمدة 15 دقيقة يومياً وتجنب حمل الأوزان الثقيلة.",
    hasImage: false
  },
  "2": {
    type: "psychiatry",
    title: "حصة مع طبيب نفسي",
    date: "2026-06-21",
    time: "14:30",
    providerName: "د. سارة محمود",
    providerSpecialty: "استشارية طب نفسي",
    patientName: "فاطمة الزهراء",
    report: "الجلسة الأولى: تم تقييم الحالة العامة للمريض ومناقشة الضغوطات اليومية. تجاوب جيد مع تقنيات الاسترخاء المبدئية.",
    notes: "يُرجى محاولة تدوين الأفكار السلبية عند ظهورها، والبدء في تطبيق تمارين التنفس العميق 3 مرات يومياً.",
    hasImage: false
  },
  "3": {
    type: "pediatrics",
    title: "حصة مع طبيب أطفال",
    date: "2026-06-22",
    time: "09:00",
    providerName: "د. ياسين كمال",
    providerSpecialty: "أخصائي طب الأطفال",
    patientName: "يوسف (طفل)",
    report: "فحص دوري عام: النمو البدني طبيعي، الوزن 18 كجم، الطول 105 سم. لا توجد أي علامات لالتهابات في الحلق أو الأذن. تلقى التطعيمات اللازمة لهذا العمر.",
    notes: "إعطاء خافض حرارة (باراسيتامول) في حال ارتفاع درجة الحرارة بسبب التطعيم الليلة. التركيز على شرب السوائل.",
    hasImage: false
  },
  "4": {
    type: "lab-tests",
    title: "تحاليل طبية",
    date: "2026-06-23",
    time: "11:00",
    providerName: "مختبر ألفا الطبي",
    providerSpecialty: "مختبر تحاليل طبية شاملة",
    patientName: "محمد عبد الله",
    report: "تم إجراء تحليل صورة دم كاملة (CBC) وتحليل سكر صائم. جميع المؤشرات الحيوية في نطاقها الطبيعي، ما عدا نقص طفيف جداً في فيتامين د.",
    notes: "مرفق صورة مفصلة لنتيجة التحاليل من المختبر للرجوع إليها أو عرضها على طبيبك المختص.",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
};

export default function TreatmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const treatment = MOCK_TREATMENTS[id];

  if (!treatment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">لم يتم العثور على التقرير</h2>
        <button onClick={() => router.push('/dashboard/my-requests')} className="mt-4 text-red-600 hover:underline">العودة لطلباتي</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => router.push('/dashboard/my-requests')}>طلباتي</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium">تقرير: {treatment.title}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
              {SERVICE_ICONS[treatment.type]}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" /> معلومات المريض
          </h3>
          <p className="font-medium text-slate-900 dark:text-white text-lg">{treatment.patientName}</p>
        </div>

        {/* Provider Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" /> مقدم الخدمة
          </h3>
          <p className="font-bold text-slate-900 dark:text-white text-lg">{treatment.providerName}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{treatment.providerSpecialty}</p>
        </div>
      </div>

      {/* Medical Report */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
          <FileText className="w-6 h-6 text-red-500" /> التقرير الطبي
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

      {/* Attachments / Lab Results */}
      {treatment.hasImage && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
              <ImageIcon className="w-6 h-6 text-blue-500" /> نتيجة التحاليل المرفقة
            </h3>
            <button className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors">
              <Download className="w-4 h-4" /> تحميل
            </button>
          </div>
          
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img 
              src={treatment.imageUrl} 
              alt="نتيجة التحليل" 
              className="w-full h-auto max-h-[600px] object-cover hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in"
            />
          </div>
        </div>
      )}
    </div>
  );
}
