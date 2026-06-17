'use client';

import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, CheckCircle2 } from "lucide-react";

export default function ProviderProfilePage() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t("professional_profile")}</h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">{t("update_data_desc")}</p>
        </div>
        <button className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
          {t("save_changes")}
        </button>
      </div>

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
                  <input type="text" defaultValue={session?.user?.name || ""} placeholder="د. أحمد عبد الله" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("specialty")}</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors text-slate-700">
                    <option>أخصائي علاج طبيعي</option>
                    <option>مخبر تحاليل طبية</option>
                    <option>ممرض رعاية منزلية</option>
                    <option>طبيب عام</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("bio")}</label>
                <textarea rows={3} placeholder="اكتب نبذة عن خبراتك، شهاداتك، وطريقة عملك..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white resize-none transition-colors"></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Location */}
          <div className="pt-8 border-b border-slate-100 dark:border-slate-800 pb-8 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{t("service_pricing")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("years_of_experience")}</label>
                <div className="relative">
                  <input type="number" placeholder="5" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                  <span className="absolute left-4 top-3 text-slate-400 dark:text-slate-500 text-sm">{t("years")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("work_area")}</label>
                <input type="text" placeholder="الجزائر العاصمة وضواحيها" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("default_travel_cost")}</label>
                <div className="relative">
                  <input type="number" placeholder="1000" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                  <span className="absolute left-4 top-3 text-slate-400 dark:text-slate-500 text-sm font-bold">{t("currency")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="pt-8 border-b border-slate-100 dark:border-slate-800 pb-8 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t("available_work_hours")}</h3>
              <span className="bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-500/30">{t("weekly_schedule")}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {/* Day 1 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-600 rounded" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-20">{t("sunday")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="time" defaultValue="08:00" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                  <span className="text-slate-400 dark:text-slate-500">-</span>
                  <input type="time" defaultValue="16:00" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                </div>
              </div>
              {/* Day 2 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-600 rounded" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 w-20">الاثنين</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="time" defaultValue="08:00" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                  <span className="text-slate-400 dark:text-slate-500">-</span>
                  <input type="time" defaultValue="16:00" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 dark:text-white transition-colors" />
                </div>
              </div>
              {/* Day 3 */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" />
                  <span className="font-bold text-slate-500 dark:text-slate-400 w-20">الجمعة</span>
                </div>
                <div className="text-sm font-bold text-slate-400 dark:text-slate-500">يوم راحة</div>
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className="pt-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">الوثائق المهنية (للتحقق من الحساب)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-4 rounded-xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">الشهادة الجامعية</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">تم الرفع والتحقق</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-dashed p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/30 transition-colors group">
                <div className="text-center">
                  <p className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 text-sm mb-1">+ إضافة رخصة مزاولة المهنة (اختياري)</p>
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
