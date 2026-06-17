'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Ambulance, PlusCircle } from "lucide-react";

export default function RequestsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">{t("requests")}</h2>
          <p className="text-gray-600 dark:text-slate-400 transition-colors">{t("manage_requests_desc")}</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 dark:bg-red-500 text-white px-5 py-2 rounded-2xl font-bold hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm">
          <PlusCircle className="w-5 h-5" /> {t("create_new_request").replace('+', '').trim()}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-slate-800 pb-2 transition-colors">
        <button className="text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600 dark:border-red-400 pb-2 px-2 transition-colors">{t("active_requests")}</button>
        <button className="text-gray-500 dark:text-slate-400 font-medium hover:text-gray-700 dark:hover:text-white pb-2 px-2 transition-colors">{t("previous_requests")}</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Empty State */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-colors">
          <div className="mb-4 text-red-500 dark:text-red-400 opacity-50 bg-red-50 dark:bg-red-500/10 p-6 rounded-full">
            <Ambulance className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t("no_active_requests_title")}</h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {t("no_active_requests_desc")}
          </p>
          <button className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
            {t("create_first_request")}
          </button>
        </div>
      </div>
    </div>
  );
}
