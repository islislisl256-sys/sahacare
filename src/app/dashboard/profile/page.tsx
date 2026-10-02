'use client';

import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { Loader2, Key, Edit2, MapPin, Briefcase } from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function Profile() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Provider Form State
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [dayOff, setDayOff] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
        }
        if (data.providerProfile) {
          setSpecialty(data.providerProfile.specialty || "");
          setBio(data.providerProfile.bio || "");
          setWorkArea(data.providerProfile.work_area || "");
          setDayOff(data.providerProfile.day_off || "");
          setLocationLat(data.providerProfile.location_lat || null);
          setLocationLng(data.providerProfile.location_lng || null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          specialty,
          bio,
          work_area: workArea,
          day_off: dayOff,
          location_lat: locationLat,
          location_lng: locationLng,
          newPassword: newPassword ? newPassword : undefined
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "تم حفظ التعديلات بنجاح" });
        setNewPassword(""); // Clear password field
        setIsEditing(false); // Hide edit mode after save
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || "حدث خطأ أثناء الحفظ" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "تعذر الاتصال بالخادم" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">{t("profile")}</h2>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-red-600 dark:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              تعديل البيانات
            </button>
          ) : (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 dark:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("save_changes") || "حفظ التعديلات"}
            </button>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-5 py-2.5 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 dark:border-slate-800 pb-8">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-4xl sm:text-5xl shadow-inner">
              {session?.user?.email?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Info Form */}
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">الاسم الكامل</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                      {name || "غير محدد"}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">البريد الإلكتروني</label>
                  <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-500 dark:text-slate-400 font-medium">
                    {session?.user?.email || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{t("phone_number")}</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                      {phone || "غير محدد"}
                    </div>
                  ) : (
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxxx"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{t("address")}</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                      {address || "غير محدد"}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Provider Specific Section */}
          {(session?.user as any)?.role === 'provider' && (
            <div className="pt-8 border-t border-gray-100 dark:border-slate-800 mt-8">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-red-500" /> معلومات العيادة / العمل
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">التخصص</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                      {specialty || "غير محدد"}
                    </div>
                  ) : (
                    <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:text-white" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">منطقة العمل</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                      {workArea || "غير محدد"}
                    </div>
                  ) : (
                    <input type="text" value={workArea} onChange={(e) => setWorkArea(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:text-white" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">أيام العطلة</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium">
                      {dayOff || "غير محدد"}
                    </div>
                  ) : (
                    <input type="text" value={dayOff} onChange={(e) => setDayOff(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:text-white" />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">نبذة عنك</label>
                  {!isEditing ? (
                    <div className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-gray-800 dark:text-white font-medium min-h-[100px] whitespace-pre-wrap">
                      {bio || "لم يتم كتابة نبذة بعد."}
                    </div>
                  ) : (
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:text-white min-h-[100px]" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> موقع المركز على الخريطة
                  <span className="text-xs text-gray-400 font-normal">(يستخدم لحساب المسافة للمرضى)</span>
                </label>
                <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 z-0">
                  <MapPicker 
                    initialCoords={locationLat && locationLng ? { lat: locationLat, lng: locationLng } : undefined}
                    onLocationSelect={(location) => {
                      if (isEditing) {
                        setLocationLat(location.lat);
                        setLocationLng(location.lng);
                      }
                    }}
                    onClose={() => {}}
                  />
                </div>
                {!isEditing && (!locationLat || !locationLng) && (
                  <p className="text-sm text-amber-600 mt-2">يرجى الضغط على تعديل البيانات لاختيار موقع مركزك.</p>
                )}
              </div>
            </div>
          )}

          {/* Security (Password Change) */}
          {isEditing && (
            <div className="pt-8">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5" /> تغيير كلمة المرور
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="اتركها فارغة إذا لم ترد التغيير" 
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
