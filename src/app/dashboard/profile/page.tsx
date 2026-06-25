'use client';

import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { Loader2, Key } from "lucide-react";

export default function Profile() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
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
          phone,
          address,
          newPassword: newPassword ? newPassword : undefined
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "تم حفظ التعديلات بنجاح" });
        setNewPassword(""); // Clear password field
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
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 dark:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("edit_data")}
          </button>
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
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-gray-500 dark:text-slate-400 cursor-not-allowed transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{t("phone_number")}</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxxx"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{t("address")}</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 dark:focus:border-red-400 dark:text-white transition-colors" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security (Password Change) */}
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
        </div>
      </div>
    </div>
  );
}
