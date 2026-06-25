'use client';

import { useLanguage } from "@/context/LanguageContext";

export default function Appointments() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t("manage_appointments")}</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          {t("new_appointment")}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 text-center text-gray-500 py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{t("no_appointments")}</h3>
          <p className="dark:text-slate-400">{t("no_appointments_desc")}</p>
        </div>
      </div>
    </div>
  );
}
