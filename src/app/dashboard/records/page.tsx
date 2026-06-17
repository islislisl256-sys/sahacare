'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Upload, FolderOpen } from "lucide-react";

export default function RecordsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">{t("digital_health_record")}</h2>
          <p className="text-gray-600 dark:text-slate-400 transition-colors">{t("digital_record_desc")}</p>
        </div>
        <button className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-5 py-2 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm flex items-center gap-2">
          <Upload className="w-4 h-4" /> {t("upload_new_file")}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <div className="flex gap-4 border-b border-gray-100 dark:border-slate-800 pb-4 mb-6 transition-colors">
          <select className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none transition-colors">
            <option>{t("all_family_members")}</option>
            <option>{t("you_primary")}</option>
          </select>
          <select className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none transition-colors">
            <option>{t("all_files")}</option>
            <option>{t("labs")}</option>
            <option>{t("prescriptions")}</option>
            <option>{t("xrays")}</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-500 mb-4 border border-gray-100 dark:border-slate-700 transition-colors">
            <FolderOpen className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{t("no_files_yet")}</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm">
            {t("no_files_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
