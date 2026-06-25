'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Megaphone, Hourglass, DollarSign, MapPin, Clock, FileText } from "lucide-react";

export default function ProviderDashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t("new_requests_today")}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">12</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t("pending_offers")}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">3</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Hourglass className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t("expected_profits_week")}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">45,000 <span className="text-base text-slate-500 dark:text-slate-400 font-medium">{t("currency")}</span></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t("job_board")}</h3>
          <div className="flex gap-2">
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
              <option>{t("filter_by_distance")}</option>
              <option>{t("less_than_5km")}</option>
              <option>{t("less_than_15km")}</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 gap-4">
          {/* Job Card 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-md text-xs font-bold mb-3 border border-teal-100 dark:border-teal-500/20">
                  {t("required")} {t("service_physical_therapy")}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{t("job_1_title")}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> بن عكنون ({t("distance_km")} 4.2 كم)</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t("ago")} 2 {t("hours")}</span>
                </div>
              </div>
              <div className="text-left bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t("patient_budget")}</p>
                <p className="text-xl font-black text-slate-800 dark:text-white">3,000 {t("currency")} <span className="text-sm font-normal">/ {t("session")}</span></p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm my-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl leading-relaxed border border-slate-100 dark:border-slate-700">
              {t("job_1_desc")}
            </p>
            <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
                {t("submit_offer")}
              </button>
              <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" /> {t("view_medical_record")}
              </button>
            </div>
          </div>

          {/* Job Card 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-md text-xs font-bold mb-3 border border-teal-100 dark:border-teal-500/20">
                  {t("required")} {t("service_lab_tests")}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{t("job_2_title")}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> دالي ابراهيم ({t("distance_km")} 2.1 كم)</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t("ago")} 15 {t("minutes")}</span>
                </div>
              </div>
              <div className="text-left bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t("patient_budget")}</p>
                <p className="text-xl font-black text-slate-800 dark:text-white">{t("unspecified")}</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm my-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl leading-relaxed border border-slate-100 dark:border-slate-700">
              {t("job_2_desc")}
            </p>
            <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
                {t("submit_offer")}
              </button>
              <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" /> {t("view_prescription")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
