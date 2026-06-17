'use client';

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon, Megaphone, Hospital, Star, UserCircle, Shield, LogOut } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center w-10 h-10"
      title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as any)}
      className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-3 py-2 outline-none border border-transparent focus:border-teal-500 font-bold"
    >
      <option value="ar">العربية (AR)</option>
      <option value="fr">Français (FR)</option>
      <option value="en">English (EN)</option>
    </select>
  );
}

function ProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "provider") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || (status === "authenticated" && (session?.user as any)?.role !== "provider")) {
    return <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950 text-teal-600 font-bold">جاري التحقق من الصلاحيات...</div>;
  }

  const navigation = [
    { name: t("available_jobs"), href: "/provider", icon: <Megaphone className="w-5 h-5" /> },
    { name: t("my_patients"), href: "/provider/patients", icon: <Hospital className="w-5 h-5" /> },
    { name: t("subscription"), href: "/provider/subscription", icon: <Star className="w-5 h-5" /> },
    { name: t("profile"), href: "/provider/profile", icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-800">
          <img src="/sahscare.jpg" alt="SahaCare" className="h-10 w-10 rounded-full mx-3 border border-teal-200 shadow-sm" />
          <h1 className="text-xl font-bold text-teal-600 dark:text-teal-400">{t("provider_dashboard")}</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-2xl transition-colors ${
                      isActive
                        ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold border border-teal-100 dark:border-teal-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="mx-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href={(session?.user as any)?.role === 'admin' ? "/admin" : "/admin-login"}
            className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-2xl transition-colors border border-amber-200 dark:border-amber-500/30 shadow-sm"
          >
            <Shield className="w-4 h-4" /> {t("admin_panel")}
          </Link>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold">
              {session?.user?.email?.[0]?.toUpperCase() || "P"}
            </div>
            <div className="mx-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {session?.user?.name || t("welcome")}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header Bar for Desktop Settings */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
              <span className={`w-3 h-3 rounded-full mx-2 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{isOnline ? t("online") : t("offline")}</span>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className="mx-4 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                {t("change_status")}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center w-10 h-10"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
          <div className="flex items-center">
            <img src="/sahscare.jpg" alt="SahaCare" className="h-8 w-8 rounded-full mx-2 border border-teal-200" />
            <h1 className="text-xl font-bold text-teal-600 dark:text-teal-500">SahaCare</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center w-10 h-10"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 mx-1 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-20 absolute w-full mt-16 shadow-lg">
            <ul className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-2xl text-base font-medium ${
                        isActive
                          ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="mx-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return <ProviderContent>{children}</ProviderContent>;
}
