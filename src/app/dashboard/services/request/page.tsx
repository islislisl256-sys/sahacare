'use client';

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, Upload, X, FileText, ChevronRight, CheckCircle2, Loader2, Map, User as UserIcon, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700"><Loader2 className="w-6 h-6 animate-spin text-red-500" /></div>
});

const SERVICE_LABELS: Record<string, { label: string; color: string }> = {
  "physical-therapy": { label: "علاج طبيعي", color: "blue" },
  "psychiatry": { label: "حصة مع طبيب نفسي", color: "purple" },
  "pediatrics": { label: "حصة مع طبيب أطفال", color: "green" },
  "lab-tests": { label: "تحاليل طبية", color: "red" },
};

function RequestServiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const serviceType = searchParams?.get("type") || "physical-therapy";
  const service = SERVICE_LABELS[serviceType] || SERVICE_LABELS["physical-therapy"];
  const isLabTest = serviceType === "lab-tests";

  const [address, setAddress] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [suggestions, setSuggestions] = useState<{name: string, lat: number, lon: number}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.data) {
          if (json.data.name) setPatientName(json.data.name);
          if (json.data.phone) setPatientPhone(json.data.phone);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length > 2 && !address.includes("تحديد")) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ' الجزائر')}&limit=4&addressdetails=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            const parsedSuggestions = data.map((d: any) => {
              const name = d.address.road || d.name;
              const city = d.address.city || d.address.town || d.address.state;
              return {
                name: `${name}${city ? '، ' + city : ''}`,
                lat: parseFloat(d.lat),
                lon: parseFloat(d.lon)
              };
            });
            // Filter unique names
            const unique = parsedSuggestions.filter((v: any, i: number, a: any) => a.findIndex((t: any) => (t.name === v.name)) === i);
            setSuggestions(unique);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
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

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "prescriptions");
    
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationLat || !locationLng) {
      setErrorMsg("الرجاء تحديد الموقع الجغرافي على الخريطة");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      // Image upload disabled as requested
      const prescriptionUrl = null;
      
      const payload = {
        serviceType,
        description: `Date: ${date} Time: ${time}\nNotes: ${notes}`,
        budget: parseFloat(budget) || null,
        locationLat,
        locationLng,
        addressText: address,
        prescriptionUrl,
        patientName,
        patientPhone
      };
      
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create request");
      }
      
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("request_sent_title")}</h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm">
          {t("request_sent_desc")} <strong>{service.label}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/dashboard/my-requests')}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
          >
            {t("follow_my_requests")}
          </button>
          <button
            onClick={() => { setSubmitted(false); setNotes(""); setImages([]); setPreviews([]); }}
            className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t("request_another")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
        <span className="hover:text-red-600 cursor-pointer" onClick={() => router.push('/dashboard/services')}>{t("services_breadcrumb")}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium">{service.label}</span>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t("service_request_title")} {service.label}</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">{t("request_header_desc")}</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Info */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-sm">
                <UserIcon className="w-4 h-4 text-red-500" /> {(t as any)("name") || "الاسم"}
              </label>
              <input
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-sm">
                <Phone className="w-4 h-4 text-red-500" /> {t("phone") || "رقم الهاتف"}
              </label>
              <input
                required
                type="tel"
                value={patientPhone}
                onChange={e => setPatientPhone(e.target.value)}
                placeholder="05xxxxxx"
                className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
          <label className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-sm">
            <Map className="w-4 h-4 text-red-500" /> {t("location_on_map")}
          </label>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <input
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                onFocus={() => address.length > 2 && setShowSuggestions(true)}
                placeholder={t("search_location_placeholder")}
                className={`w-full border ${locationLat ? 'border-green-400' : 'border-gray-200'} dark:border-slate-700 rounded-2xl px-10 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors`}
              />
              <MapPin className={`absolute right-3 top-3.5 w-4 h-4 ${locationLat ? 'text-green-500' : 'text-gray-400'} dark:text-slate-500`} />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 left-0 right-0 z-20 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-colors border-b last:border-0 border-gray-100 dark:border-slate-700"
                      onClick={() => { 
                        setAddress(s.name); 
                        setLocationLat(s.lat);
                        setLocationLng(s.lon);
                        setShowSuggestions(false); 
                        setShowMapModal(true); // Open map to verify
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-4 py-3 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
              title={t("confirm_location")}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
          
          {/* Real Interactive Map View */}
          {showMapModal && (
            <div className="mt-4">
              <MapPicker 
                initialCoords={locationLat ? { lat: locationLat, lng: locationLng! } : null}
                onLocationSelect={(loc) => {
                  setAddress(loc.address);
                  setLocationLat(loc.lat);
                  setLocationLng(loc.lng);
                  setShowMapModal(false);
                }} 
                onClose={() => setShowMapModal(false)} 
              />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <label className="block font-bold text-gray-800 dark:text-white text-sm mb-3">الميزانية المقترحة <span className="font-normal text-gray-400">({t("optional")})</span></label>
          <div className="relative">
            <input
              type="number"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              placeholder="مثال: 1500"
              className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 transition-colors"
            />
            <span className="absolute left-4 top-3 text-gray-400 text-sm">دج</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <label className="block font-bold text-gray-800 dark:text-white text-sm mb-3">{t("preferred_date")}</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">{t("date_label")}</label>
              <input
                required type="date"
                value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">{t("time_label")}</label>
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
              <FileText className="w-4 h-4 text-red-500" /> {t("doctor_prescriptions")}
              <span className="text-xs font-normal text-gray-400">({t("optional")})</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-slate-400">{t("prescriptions_help")}</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center gap-3 py-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <Upload className="w-7 h-7 text-red-500" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{t("click_to_upload_short")}</span>
              <span className="text-xs text-gray-400">PNG, JPG, PDF {t("file_size_limit").includes("10") ? t("file_size_limit") : "حتى 10MB"}</span>
            </button>
            <input
              ref={fileRef} type="file" accept="image/*,.pdf"
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
          <label className="block font-bold text-gray-800 dark:text-white text-sm mb-3">{t("extra_notes")} <span className="font-normal text-gray-400">({t("optional")})</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder={t("feedback_placeholder")}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-red-400 resize-none transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/30 hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t("sending_request")}</> : t("send_request")}
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
