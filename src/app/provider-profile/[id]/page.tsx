'use client';

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, User, PhoneCall, Award, Activity, MapPin, CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

import { calculateDistance } from "@/lib/distance";

export default function ProviderProfilePage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [distance, setDistance] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/provider-profile/${id}`);
      if (!res.ok) throw new Error("لم يتم العثور على المعالج");
      const data = await res.json();
      setProvider(data.data);
      
      // Calculate distance if provider has location
      if (data.data.profile?.location_lat && data.data.profile?.location_lng) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const d = calculateDistance(
                position.coords.latitude,
                position.coords.longitude,
                data.data.profile.location_lat,
                data.data.profile.location_lng
              );
              setDistance(Math.round(d));
            },
            () => console.warn("Geolocation permission denied")
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">جاري تحميل ملف المعالج...</p>
      </div>
    );
  }

  if (errorMsg || !provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-xl font-bold text-slate-800 dark:text-white mb-4">{errorMsg}</p>
        <button onClick={() => router.back()} className="text-red-600 font-bold hover:underline">
          عودة
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">الملف الشخصي للمعالج</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 dark:bg-red-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            {provider.avatar_url ? (
              <img src={provider.avatar_url} alt={provider.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              {provider.name}
              {provider.profile?.is_verified && (
                <CheckCircle2 className="w-6 h-6 text-green-500" title="موثق" />
              )}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2 flex items-center justify-center md:justify-start gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              {provider.profile?.specialty || "تخصص غير محدد"}
            </p>
            
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              {provider.phone && (
                <a 
                  href={`tel:${provider.phone}`}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <PhoneCall className="w-5 h-5" />
                  مكالمة المعالج
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> نبذة عن المعالج
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {provider.profile?.bio || "لا توجد نبذة شخصية مكتوبة لهذا المعالج حتى الآن."}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" /> منطقة العمل والمسافة
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {provider.profile?.work_area || "غير محدد"}
            </p>
            {distance !== null ? (
              <p className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl inline-block mt-2">
                يبعد عنك بحوالي: {distance} كم
              </p>
            ) : (
              <p className="text-slate-500 text-sm mt-2">المسافة غير متاحة (تتطلب تحديد موقع المركز)</p>
            )}

            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mt-6">
              <CalendarDays className="w-5 h-5 text-teal-500" /> أيام العطلة
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {provider.profile?.day_off || "غير محدد"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
