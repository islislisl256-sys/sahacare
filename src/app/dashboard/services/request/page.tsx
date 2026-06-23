'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Upload, X, FileText, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";

const SERVICE_LABELS: Record<string, { label: string; color: string }> = {
  "physical-therapy": { label: "علاج طبيعي", color: "blue" },
  "psychiatry": { label: "حصة مع طبيب نفسي", color: "purple" },
  "pediatrics": { label: "حصة مع طبيب أطفال", color: "green" },
  "lab-tests": { label: "تحاليل طبية", color: "red" },
};

export default function RequestServicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceType = searchParams?.get("type") || "physical-therapy";
  const service = SERVICE_LABELS[serviceType] || SERVICE_LABELS["physical-therapy"];
  const isLabTest = serviceType === "lab-tests";

  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Simulate Google Maps autocomplete
  const mockSuggestions = [
    "شارع العروبة، الرياض، المملكة العربية السعودية",
    "شارع الملك فهد، الرياض، المملكة العربية السعودية",
    "شارع التحلية، جدة، المملكة العربية السعودية",
    "شارع الأمير سلطان، جدة، المملكة العربية السعودية",
    "شارع الحبيب بورقيبة، تونس العاصمة",
    "شارع محمد الخامس، الدار البيضاء",
    "شارع الرشيد، الجزائر العاصمة",
  ];

  useEffect(() => {
    if (address.length > 2) {
      const filtered = mockSuggestions.filter(s =>
        s.toLowerCase().includes(address.toLowerCase()) || address.length > 3
      );
      setSuggestions(filtered.slice(0, 4));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [address]);

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
    }, 1800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تم إرسال طلبك بنجاح! 🎉</h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm">
          سيتم التواصل معك قريباً لتأكيد موعد <strong>{service.label}</strong>. يمكنك متابعة حالة طلبك في صفحة الطلبات.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/dashboard/my-requests')}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
          >
            متابعة طلباتي
          </button>
          <button
            onClick={() => router.push('/dashboard/services')}
            className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            طلب خدمة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
        <span className="hover:text-red-600 cursor-pointer" onClick={() => router.push('/dashboard/services')}>الخدمات</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium">{service.label}</span>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">طلب خدمة: {service.label}</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">يرجى ملء التفاصيل أدناه وسنتواصل معك لتأكيد الموعد</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Location Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
          <label className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-sm">
            <MapPin className="w-4 h-4 text-red-500" /> موقعك على الخريطة
          </label>
          <div className="relative">
            <input
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              onFocus={() => address.length > 2 && setShowSuggestions(true)}
              placeholder="ابحث بالاسم، الحي، أو حدد على الخريطة..."
              className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors"
            />
            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-slate-500" />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 left-0 right-0 z-20 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-colors border-b last:border-0 border-gray-100 dark:border-slate-700"
                    onClick={() => { setAddress(s); setShowSuggestions(false); }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Map Placeholder */}
          <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-slate-600 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-slate-500">
            <MapPin className="w-8 h-8 text-red-400" />
            <p className="text-sm">خريطة Google Maps</p>
            <p className="text-xs">ستظهر الخريطة التفاعلية هنا</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <label className="block font-bold text-gray-800 dark:text-white text-sm mb-3">📅 الموعد المفضل</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">التاريخ</label>
              <input
                required type="date"
                value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">الوقت</label>
              <input
                required type="time"
                value={time} onChange={e => setTime(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400"
              />
            </div>
          </div>
        </div>

        {/* Lab Test: Prescription Upload */}
        {isLabTest && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-dashed border-red-200 dark:border-red-500/30 shadow-sm space-y-3">
            <label className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-sm">
              <FileText className="w-4 h-4 text-red-500" /> وصفات الطبيب / نتائج سابقة
              <span className="text-xs font-normal text-gray-400">(اختياري)</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-slate-400">أرفق صور وصفات الطبيب أو نتائج التحاليل السابقة لمساعدة الفريق الطبي</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center gap-3 py-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <Upload className="w-7 h-7 text-red-500" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">انقر لرفع الصور</span>
              <span className="text-xs text-gray-400">PNG, JPG, PDF حتى 10MB</span>
            </button>
            <input
              ref={fileRef} type="file" multiple accept="image/*,.pdf"
              className="hidden" onChange={handleImages}
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <label className="block font-bold text-gray-800 dark:text-white text-sm mb-3">📝 ملاحظات إضافية <span className="font-normal text-gray-400">(اختياري)</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="أي معلومات إضافية تريد إضافتها..."
            className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 resize-none transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/30 hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</> : "إرسال الطلب"}
        </button>
      </form>
    </div>
  );
}
