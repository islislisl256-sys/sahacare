'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, CheckCircle2, ChevronRight, Upload, X, Loader2, User, Activity } from "lucide-react";

export default function AddTreatmentPage() {
  const router = useRouter();
  
  const [report, setReport] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تم إضافة التقرير بنجاح!</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          تم تحديث حالة الطلب إلى مكتمل، ويمكن للمريض الآن الاطلاع على التقرير.
        </p>
        <button
          onClick={() => router.push('/provider/patients')}
          className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-colors mt-4"
        >
          العودة لقائمة المرضى
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="hover:text-teal-600 cursor-pointer transition-colors" onClick={() => router.push('/provider/patients')}>إدارة المرضى</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium">إضافة تقرير علاج</span>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xl">
            أح
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">أحمد بن فلان</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> 65 سنة</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> تأهيل حركي (3 جلسات)</span>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          الحالة: قيد المراجعة
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
          <div>
            <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-white text-base mb-2">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" /> 
              تفاصيل التقرير الطبي
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">اكتب وصفاً مفصلاً للإجراءات التي تمت خلال الجلسة أو العلاج.</p>
          </div>
          
          <textarea
            required
            value={report}
            onChange={e => setReport(e.target.value)}
            rows={5}
            placeholder="مثال: المريض أظهر تحسناً ملحوظاً في الحركة بنسبة 30%، تم إجراء تمارين الإطالة والتقوية للعضلة الخلفية..."
            className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500 resize-none transition-colors"
          />

          <div className="pt-2">
            <label className="block font-bold text-slate-800 dark:text-white text-sm mb-2">ملاحظات للمريض <span className="text-slate-400 font-normal">(اختياري)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="نصائح أو أدوية يرجى الالتزام بها..."
              className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Upload Images (Lab Results / Scans) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
          <div>
            <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-white text-base mb-1">
              <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400" /> 
              مرفقات ونتائج التحاليل
              <span className="text-xs font-normal text-slate-400 mr-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">(اختياري)</span>
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400">إذا كان العلاج يتضمن تحاليل أو أشعة، قم برفع الصور هنا لكي يتمكن المريض من رؤيتها.</p>
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-teal-50/50 dark:bg-teal-500/5 border-2 border-dashed border-teal-200 dark:border-teal-500/20 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-500/20 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-teal-700 dark:text-teal-400 block mb-1">انقر هنا لرفع الصور أو الملفات</span>
              <span className="text-xs text-slate-400">PNG, JPG, PDF (بحد أقصى 10MB)</span>
            </div>
          </button>
          <input
            ref={fileRef} type="file" multiple accept="image/*,.pdf"
            className="hidden" onChange={handleImages}
          />
          
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !report}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري حفظ التقرير...</> : "حفظ وإنهاء العلاج"}
          </button>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">بمجرد الحفظ، سيتم إشعار المريض بإكتمال الخدمة.</p>
        </div>
      </form>
    </div>
  );
}
