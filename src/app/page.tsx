'use client';

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Home as HomeIcon, Folder, Users } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home(){
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  const getDashboardLink = () => {
    const role = (session?.user as any)?.role;
    if (role === 'admin') return '/admin';
    if (role === 'provider') return '/provider';
    return '/dashboard'; // Default patient
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-100/50 via-transparent to-transparent dark:from-red-900/20"></div>
      
      {/* Top Bar for Language and Theme */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="flex justify-center mb-4">
          <img src="/sahacare.jpg" alt="SahaCare Logo" className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-800" />
        </div>
        <h1 className="text-4xl font-extrabold text-red-700 dark:text-red-500 tracking-tight">
          SahaCare
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto font-medium">
          {t("hero_subtitle")}
        </p>
      </div>
      
      {status === "loading" ? (
        <div className="rounded-full px-4 sm:px-8 py-3 sm:py-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold animate-pulse relative z-10 text-sm sm:text-base">{t("logging_in")}</div>
      ) : session ? (
        <Link
          href={getDashboardLink()}
          className="rounded-full bg-red-600 px-4 sm:px-8 py-3 sm:py-4 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 font-bold shadow-lg transition-transform hover:scale-105 relative z-10 text-sm sm:text-base w-full max-w-[200px] sm:max-w-none text-center truncate"
        >
          {t("enter_dashboard")}
        </Link>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 relative z-10 w-full max-w-[200px] sm:max-w-none">
          <button
            onClick={() => signIn()}
            className="rounded-full bg-red-600 px-4 sm:px-8 py-3 sm:py-4 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 font-bold shadow-lg transition-transform hover:scale-105 text-sm sm:text-base w-full"
          >
            {t("signin")}
          </button>
          <Link
            href="/auth/signup"
            className="rounded-full bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/50 px-4 sm:px-8 py-3 sm:py-4 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 font-bold shadow-sm transition-transform hover:scale-105 text-center text-sm sm:text-base w-full"
          >
            {t("signup")}
          </Link>
        </div>
      )}

      <div className="mt-8 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center w-full max-w-4xl relative z-10 px-2 sm:px-0">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-red-50 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-2 sm:mb-3">
            <HomeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{t("home_services")}</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{t("home_services_desc")}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-red-50 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-2 sm:mb-3">
            <Folder className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{t("landing_digital_record")}</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{t("landing_digital_record_desc")}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-red-50 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-2 sm:mb-3">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{t("landing_family_account")}</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{t("landing_family_account_desc")}</p>
        </div>
      </div>
    </div>
  );
}
