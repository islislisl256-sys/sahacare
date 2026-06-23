'use client';

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon, LayoutDashboard, Users, Activity, FileText, User, Shield, LogOut, HeartPulse, ClipboardList } from "lucide-react";
import AIChatButton from "@/components/AIChatButton";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center w-10 h-10"
      title={resolvedTheme === 'dark' ? t('theme_light') : t('theme_dark')}
    >
      {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as any)}
      className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-3 py-2 outline-none border border-transparent focus:border-red-500 font-bold"
    >
      <option value="ar">AR</option>
      <option value="fr">FR</option>
      <option value="en">EN</option>
    </select>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navigation = [
    { name: t("patient_dashboard"), href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "الخدمات الصحية", href: "/dashboard/services", icon: <HeartPulse className="w-5 h-5" /> },
    { name: "طلباتي", href: "/dashboard/my-requests", icon: <ClipboardList className="w-5 h-5" /> },
    { name: t("family"), href: "/dashboard/family", icon: <Users className="w-5 h-5" /> },
    { name: t("records"), href: "/dashboard/records", icon: <FileText className="w-5 h-5" /> },
    { name: t("profile"), href: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-slate-800">
          <img src="/sahacare.jpg" alt="SahaCare" className="h-10 w-10 rounded-full mx-3 border border-red-200 shadow-sm" />
          <h1 className="text-xl font-bold text-red-600 dark:text-red-500">SahaCare</h1>
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
                        ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-bold border border-red-100 dark:border-red-500/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
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
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <Link
            href={(session?.user as any)?.role === 'admin' ? "/admin" : "/admin-login"}
            className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-2xl transition-colors border border-amber-200 dark:border-amber-500/30 shadow-sm"
          >
            <Shield className="w-4 h-4" /> {t("admin_panel")}
          </Link>
          <div className="flex items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-700 dark:text-red-400 font-bold">
              {session?.user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="mx-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session?.user?.name || t("welcome")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header Bar for Desktop Settings */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
          <div></div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center w-10 h-10"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center">
            <img src="/sahscare.jpg" alt="SahaCare" className="h-8 w-8 rounded-full mx-2 border border-red-200" />
            <h1 className="text-xl font-bold text-red-600 dark:text-red-500">SahaCare</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center w-10 h-10"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 mx-1 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-start md:hidden">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="relative flex flex-col w-64 max-w-[80%] bg-white dark:bg-slate-900 h-full border-l border-gray-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-right-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-slate-800">
                <div className="flex items-center">
                  <img src="/sahacare.jpg" alt="SahaCare" className="h-8 w-8 rounded-full mx-2 border border-red-200" />
                  <span className="text-xl font-bold text-red-600 dark:text-red-500">SahaCare</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="px-3 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                            isActive
                              ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-bold border border-red-100 dark:border-red-500/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="mx-3">{item.icon}</span>
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                <Link
                  href={(session?.user as any)?.role === 'admin' ? "/admin" : "/admin-login"}
                  className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-2xl transition-colors border border-amber-200 dark:border-amber-500/30 shadow-sm"
                >
                  <Shield className="w-4 h-4" /> {t("admin_panel")}
                </Link>
                <div className="flex items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-700 dark:text-red-400 font-bold">
                    {session?.user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="mx-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session?.user?.name || t("welcome")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <AIChatButton />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContent>{children}</DashboardContent>;
}
