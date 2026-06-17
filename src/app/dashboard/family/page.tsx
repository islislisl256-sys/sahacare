'use client';

import { useLanguage } from "@/context/LanguageContext";
import { PlusCircle, User } from "lucide-react";

export default function FamilyPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">{t("family")}</h2>
          <p className="text-gray-600 dark:text-slate-400 transition-colors">{t("manage_family_files")}</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 dark:bg-red-500 text-white px-5 py-2 rounded-2xl font-bold hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm">
          <PlusCircle className="w-5 h-5" /> {t("add_new_member")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main User Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border-2 border-red-200 dark:border-red-900/50 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-bl-2xl">
            {t("primary_profile")}
          </div>
          <div className="flex items-center gap-4 mb-4 mt-2">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl font-bold">
              أن
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t("you_account_owner")}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{t("age")}: 30 {t("years")} | {t("male")}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-slate-300 border-t border-gray-100 dark:border-slate-800 pt-4">
            <p><span className="font-medium">{t("blood_type")}:</span> O+</p>
            <p><span className="font-medium">{t("chronic_diseases")}:</span> {t("none")}</p>
            <p><span className="font-medium">{t("allergies")}:</span> {t("none")}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 py-2 rounded-xl font-medium border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              {t("edit_data")}
            </button>
            <button className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 py-2 rounded-xl font-medium border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors">
              {t("records")}
            </button>
          </div>
        </div>

        {/* Empty State for new family members */}
        <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-center min-h-[250px] transition-colors">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 dark:text-slate-500 mb-4">
            <PlusCircle className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-700 dark:text-slate-300 mb-1">{t("add_family_member")}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-[200px]">
            {t("add_family_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
