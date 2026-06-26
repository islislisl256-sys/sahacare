'use client';

import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Ambulance, FileText, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            {t("welcome_back")}، {session?.user?.name || session?.user?.email?.split('@')[0] || t("welcome")}!
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            {t("patient_dashboard_desc")}
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors mt-4 sm:mt-0">
          <PlusCircle className="w-5 h-5" /> {t("new_service_request").replace('+', '').trim()}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-red-500 to-red-700 dark:from-red-600 dark:to-red-900 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-lg font-bold">{t("family_files")}</h3>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1 relative z-10">1</p>
          <p className="text-red-100 dark:text-red-200 text-sm relative z-10">{t("primary_profile_registered")}</p>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors group hover:border-red-200 dark:hover:border-red-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">{t("active_requests")}</h3>
            <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
              <Ambulance className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">0</p>
          <p className="text-gray-500 dark:text-slate-500 text-sm">{t("no_active_requests")}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors group hover:border-red-200 dark:hover:border-red-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">{t("records")}</h3>
            <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">0</p>
          <p className="text-gray-500 dark:text-slate-500 text-sm">{t("reports_and_results")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 mt-8 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t("registered_family_members")}</h3>
          <button className="text-red-600 dark:text-red-400 font-bold hover:underline">{t("add_new_member")}</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-2xl flex items-center bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg mx-3">
              أن
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{t("you_primary")}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{t("no_chronic_diseases")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
