'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";

export default function ProviderPatientsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t("manage_patients")}</h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">{t("manage_patients_desc")}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 flex items-center shadow-sm w-full sm:w-64 transition-colors">
            <Search className="text-slate-400 dark:text-slate-500 w-4 h-4 ml-2" />
            <input type="text" placeholder={t("search_patient")} className="outline-none bg-transparent w-full text-sm text-slate-800 dark:text-white" />
          </div>
          <button className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {t("filter")}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 transition-colors">
              <tr>
                <th className="px-6 py-4 font-bold">{t("patient_name")}</th>
                <th className="px-6 py-4 font-bold">{t("service_type")}</th>
                <th className="px-6 py-4 font-bold">{t("location")}</th>
                <th className="px-6 py-4 font-bold">{t("start_date")}</th>
                <th className="px-6 py-4 font-bold">{t("status")}</th>
                <th className="px-6 py-4 font-bold text-center">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Patient 1 - Pending / In Treatment */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                      أح
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">أحمد بن فلان</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("male")} • 65 {t("years")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">تأهيل حركي (3 جلسات)</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">الجزائر، بن عكنون</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">12 مايو 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                    قيد المراجعة
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <a href="/provider/treatments/add/1" className="bg-teal-600 border border-teal-600 text-white hover:bg-teal-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors text-center">إضافة التقرير</a>
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">مكالمة</button>
                  </div>
                </td>
              </tr>
              
              {/* Patient 2 - Completed */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                      فا
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">فاطمة الزهراء</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("female")} • 42 {t("years")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">تحاليل دم بالمنزل</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">الجزائر، دالي ابراهيم</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">10 مايو 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                    مكتمل
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <a href="/provider/treatments/2" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">عرض التقرير</a>
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">مكالمة</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">عرض 2 من أصل 2 مرضى</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 cursor-not-allowed bg-white dark:bg-slate-900 text-sm transition-colors">{t("previous")}</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 cursor-not-allowed bg-white dark:bg-slate-900 text-sm transition-colors">{t("next")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
