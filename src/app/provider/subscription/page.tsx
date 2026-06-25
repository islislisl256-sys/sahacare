'use client';

import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ProviderSubscriptionPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white transition-colors">{t("subscription_plans")}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
          {t("subscription_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-teal-300 dark:hover:border-teal-500/50 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t("basic_plan")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">{t("basic_plan_desc")}</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{t("free")}</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("basic_feat_1")}
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("basic_feat_2")}
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("basic_feat_3")}
            </li>
            <li className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm font-medium">
              <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" /> {t("basic_feat_4")}
            </li>
          </ul>
          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {t("current_plan")}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col relative transform scale-105 z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            {t("most_requested")}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t("pro_plan")}</h3>
          <p className="text-slate-400 text-sm mb-6 h-10">{t("pro_plan_desc")}</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">2,500</span>
            <span className="text-slate-400 font-medium"> {t("per_month")}</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> {t("pro_feat_1")}
            </li>
            <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> {t("pro_feat_2")}
            </li>
            <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> {t("pro_feat_3")}
            </li>
            <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> {t("pro_feat_4")}
            </li>
          </ul>
          <button className="w-full bg-teal-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-teal-500/30 hover:bg-teal-400 transition-colors">
            {t("upgrade_soon")}
          </button>
        </div>

        {/* Clinic Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-teal-300 dark:hover:border-teal-500/50 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t("clinic_plan")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">{t("clinic_plan_desc")}</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">7,000</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium"> {t("per_month")}</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("clinic_feat_1")}
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("clinic_feat_2")}
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("clinic_feat_3")}
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" /> {t("clinic_feat_4")}
            </li>
          </ul>
          <button className="w-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-bold py-3 rounded-2xl hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors border border-teal-100 dark:border-teal-900/30">
            {t("contact_to_activate")}
          </button>
        </div>
      </div>
    </div>
  );
}
