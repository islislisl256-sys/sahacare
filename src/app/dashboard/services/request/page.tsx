'use client';

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Upload, X, FileText, ChevronRight, CheckCircle2, Loader2, Map, User as UserIcon, Phone } from "lucide-react";

const SERVICE_LABELS: Record<string, { label: string; color: string }> = {
  "physical-therapy": { label: "علاج طبيعي", color: "blue" },
  "psychiatry": { label: "حصة مع طبيب نفسي", color: "purple" },
  "pediatrics": { label: "حصة مع طبيب أطفال", color: "green" },
  "lab-tests": { label: "تحاليل طبية", color: "red" },
};

function RequestServiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceType = searchParams?.get("type") || "physical-therapy";
  const service = SERVICE_LABELS[serviceType] || SERVICE_LABELS["physical-therapy"];
  const isLabTest = serviceType === "lab-tests";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
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

  // Simulate Google Maps autocomplete for Algeria
  const mockSuggestions = [
    "الجزائر العاصمة، شارع ديدوش مراد",
    "الجزائر العاصمة، حي باب الزوار",
    "الجزائر العاصمة، الشراقة",
    "البليدة، وسط المدينة",
    "وهران، واجهة البحر",
    "قسنطينة، سيدي مبروك",
    "سطيف، بارك مال",
    "عنابة، الكورنيش",
    "تلمسان، منصورة",
    "باتنة، الممرات",
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
        {/* Personal Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2 mb-2">
            <UserIcon className="w-4 h-4 text-red-500" /> المعلومات الشخصية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">الاسم الكامل</label>
              <div className="relative">
                <input
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="الاسم واللقب"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-10 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors"
                />
                <UserIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 block">رقم الهاتف</label>
              <div className="relative">
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05XX XX XX XX"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-10 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors text-right"
                />
                <Phone className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 dark:text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
          <label className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-sm">
            <Map className="w-4 h-4 text-red-500" /> موقعك على الخريطة (الجزائر)
          </label>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <input
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                onFocus={() => address.length > 2 && setShowSuggestions(true)}
                placeholder="ابحث عن ولايتك أو حيك..."
                className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-10 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors"
              />
              <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 dark:text-slate-500" />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 left-0 right-0 z-20 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-colors border-b last:border-0 border-gray-100 dark:border-slate-700"
                      onClick={() => { 
                        setAddress(s); 
                        setShowSuggestions(false); 
                        setShowMapModal(true); // Open map when a location is picked from search
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-4 py-3 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
              title="تحديد الموقع من الخريطة"
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mock Map View embedded */}
          {showMapModal && (
            <div 
              className="w-full h-64 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden relative mt-2 group shadow-inner cursor-crosshair"
              onClick={() => {
                // Simulate clicking on the map to drop a pin and reverse geocode
                const mockLocations = ["شارع العربي بن مهيدي، الجزائر العاصمة", "حي 5 جويلية، باب الزوار", "مقام الشهيد، المدنية", "الواجهة البحرية، بومرداس", "حي الياسمين، الشراقة", "القطب الجامعي، القليعة"];
                const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
                setAddress(randomLoc);
              }}
            >
              {/* Map background image */}
              <img src="/map.png" alt="خريطة" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
              {/* Center Pin */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 transform group-hover:-translate-y-2">
                <MapPin className="w-10 h-10 text-red-600 drop-shadow-md -mt-10" fill="currentColor" />
              </div>
              
              {/* Overlay UI */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); // prevent clicking the map behind it
                    setShowMapModal(false); 
                    if(!address) setAddress("تم تحديد موقع من الخريطة");
                  }}
                  className="bg-gray-900/90 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg backdrop-blur-sm transition-colors text-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> تأكيد الموقع
                </button>
              </div>
            </div>
          )}
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

export default function RequestServicePage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>}>
      <RequestServiceContent />
    </Suspense>
  );
}
