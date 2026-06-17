'use client';

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Home as HomeIcon, Folder, Users } from "lucide-react";

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
      
      <div className="text-center mb-8 relative z-10">
        <div className="flex justify-center mb-4">
          <img src="/sahscare.jpg" alt="SahaCare Logo" className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-800" />
        </div>
        <h1 className="text-4xl font-extrabold text-red-700 dark:text-red-500 tracking-tight">
          SahaCare
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto font-medium">
          {t("hero_subtitle")}
        </p>
      </div>
      
      {status === "loading" ? (
        <div className="rounded-full px-8 py-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold animate-pulse relative z-10">{t("logging_in")}</div>
      ) : session ? (
        <Link
          href={getDashboardLink()}
          className="rounded-full bg-red-600 px-8 py-4 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 font-bold shadow-lg transition-transform hover:scale-105 relative z-10"
        >
          {t("enter_dashboard")}
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button
            onClick={() => signIn()}
            className="rounded-full bg-red-600 px-8 py-4 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 font-bold shadow-lg transition-transform hover:scale-105"
          >
            {t("signin")}
          </button>
          <Link
            href="/auth/signup"
            className="rounded-full bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/50 px-8 py-4 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 font-bold shadow-sm transition-transform hover:scale-105 text-center"
          >
            {t("signup")}
          </Link>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl relative z-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-red-50 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-3">
            <HomeIcon className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t("home_services")}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t("home_services_desc")}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-red-50 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-3">
            <Folder className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t("landing_digital_record")}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t("landing_digital_record_desc")}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-red-50 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-3">
            <Users className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t("landing_family_account")}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t("landing_family_account_desc")}</p>
        </div>
      </div>
    </div>
  );
}
