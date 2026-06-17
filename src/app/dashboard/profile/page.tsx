'use client';

import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

export default function Profile() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">{t("profile")}</h2>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-4xl sm:text-5xl shadow-inner">
              {session?.user?.email?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-right space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {session?.user?.name || t("new_user")}
                </h3>
                <p className="text-gray-500 dark:text-slate-400">{session?.user?.email}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right transition-colors">
                <div>
                  <span className="block text-sm font-medium text-gray-500 dark:text-slate-400">{t("phone_number")}</span>
                  <span className="block text-gray-900 dark:text-white">{t("unspecified")}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 dark:text-slate-400">{t("address")}</span>
                  <span className="block text-gray-900 dark:text-white">{t("unspecified")}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 dark:text-slate-400">{t("join_date")}</span>
                  <span className="block text-gray-900 dark:text-white">{t("recently")}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 dark:text-slate-400">{t("account_type")}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 mt-1">
                    {t("patient")}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                <button className="bg-red-600 dark:bg-red-500 text-white px-5 py-2 rounded-2xl font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors">
                  {t("edit_data")}
                </button>
                <button className="bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 px-5 py-2 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  {t("change_password")}
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-5 py-2 rounded-2xl font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
