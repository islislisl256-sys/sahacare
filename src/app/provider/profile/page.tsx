'use client';

import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, CheckCircle2, Loader2, Key } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProviderProfilePage() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [travelCost, setTravelCost] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || "");
        }
        if (data.providerProfile) {
          setSpecialty(data.providerProfile.specialty || "");
          setBio(data.providerProfile.bio || "");
          setWorkArea(data.providerProfile.work_area || "");
          setTravelCost(data.providerProfile.default_travel_cost?.toString() || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          specialty,
          bio,
          work_area: workArea,
          default_travel_cost: parseFloat(travelCost) || 0,
          newPassword: newPassword ? newPassword : undefined
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "تم حفظ التعديلات بنجاح" });
        setNewPassword(""); // Clear password field after success
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
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t("professional_profile")}</h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">{t("update_data_desc")}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {t("save_changes")}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 sm:p-8">
          
          {/* Personal Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-slate-100 dark:border-slate-800 pb-8 transition-colors">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-2xl bg-teal-50 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-5xl shadow-sm border border-teal-100 dark:border-teal-500/30 overflow-hidden">
                {session?.user?.email?.[0]?.toUpperCase() || "P"}
              </div>
              <div className="absolute inset-0 bg-slate-900 bg-opacity-60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-bold">{t("change_photo")}</span>
              </div>
            </div>

            <div className="flex-1 space-y-5 w-full">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">{t("basic_data")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("full_name_label")}</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="د. أحمد عبد الله" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("specialty")}</label>
                  <select 
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors text-slate-700"
                  >
                    <option value="">{t("specialty")}</option>
                    <option value="physical_therapy">{t("specialty_physical")}</option>
                    <option value="lab">{t("specialty_lab")}</option>
                    <option value="nurse">{t("specialty_nurse")}</option>
                    <option value="doctor">{t("specialty_doctor")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("bio")}</label>
                <textarea 
                  rows={3} 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("bio_placeholder")} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white resize-none transition-colors"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Location */}
          <div className="pt-8 border-b border-slate-100 dark:border-slate-800 pb-8 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{t("service_pricing")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("work_area")}</label>
                <input 
                  type="text" 
                  value={workArea}
                  onChange={(e) => setWorkArea(e.target.value)}
                  placeholder={t("work_area_placeholder")} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("default_travel_cost")}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={travelCost}
                    onChange={(e) => setTravelCost(e.target.value)}
                    placeholder="1000" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" 
                  />
                  <span className="absolute left-4 top-3 text-slate-400 dark:text-slate-500 text-sm font-bold">{t("currency")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security (Password Change) */}
          <div className="pt-8 border-b border-slate-100 dark:border-slate-800 pb-8 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Key className="w-5 h-5" /> تغيير كلمة المرور
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="اتركها فارغة إذا لم ترد التغيير" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className="pt-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{t("professional_docs")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-4 rounded-xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{t("university_degree")}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">{t("degree_verified")}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-dashed p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/30 transition-colors group">
                <div className="text-center">
                  <p className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 text-sm mb-1">{t("add_license")}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">PDF, JPG, PNG (Max: 5MB)</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
