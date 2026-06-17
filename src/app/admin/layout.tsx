"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutDashboard, Users, ClipboardList, HeartPulse, Stethoscope, ShieldCheck, LogOut, Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center w-10 h-10"
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
      className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-3 py-2 outline-none border border-transparent focus:border-amber-500 font-bold"
    >
      <option value="ar">العربية (AR)</option>
      <option value="fr">Français (FR)</option>
      <option value="en">English (EN)</option>
    </select>
  );
}

function AdminContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || (status === "authenticated" && (session?.user as any)?.role !== "admin")) {
    return <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 text-amber-500 font-bold">جاري التحقق من صلاحيات الإدارة العليا...</div>;
  }

  const navigation = [
    { name: "مركز القيادة", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "المستخدمين", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "طلبات المعالجين", href: "/admin/applications", icon: <ClipboardList className="w-5 h-5" /> },
    { name: "لوحة المريض", href: "/dashboard", icon: <HeartPulse className="w-5 h-5" /> },
    { name: "لوحة المعالج", href: "/provider", icon: <Stethoscope className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans transition-colors duration-300">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-zinc-950 dark:bg-zinc-900 text-zinc-300 shadow-2xl z-20 border-l border-zinc-800">
        <div className="flex items-center justify-center h-20 border-b border-zinc-800 bg-black dark:bg-zinc-950">
          <img src="/sahscare.jpg" alt="SahaCare" className="h-10 w-10 rounded-full ml-3 border-2 border-amber-500 shadow-sm" />
          <h1 className="text-xl font-bold text-amber-500 tracking-wide">الإدارة المركزية</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-amber-400"
                    }`}
                  >
                    <span className="ml-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 bg-black dark:bg-zinc-950 border-t border-zinc-800">
          <div className="flex items-center mb-4 bg-zinc-900 dark:bg-zinc-800 p-3 rounded-xl border border-zinc-800 dark:border-zinc-700">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-zinc-900 font-bold border-2 border-zinc-900 dark:border-zinc-800 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="mr-3 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {session?.user?.name || "المدير العام"}
              </p>
              <p className="text-xs text-amber-500 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-20 px-8 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm z-10 transition-colors duration-300">
          <div className="flex items-center">
            <h2 className="hidden md:block text-2xl font-bold text-zinc-800 dark:text-white">نظام الإدارة - SahaCare</h2>
            <div className="md:hidden flex items-center">
              <img src="/sahscare.jpg" alt="SahaCare" className="h-8 w-8 rounded-full ml-2 border-2 border-amber-500" />
              <h1 className="text-lg font-bold text-amber-600 dark:text-amber-500">SahaCare Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-bold rounded-full border border-green-200 dark:border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              النظام مستقر
            </span>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center w-10 h-10"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-start md:hidden">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="relative flex flex-col w-64 max-w-[80%] bg-zinc-950 dark:bg-zinc-900 h-full border-l border-zinc-800 shadow-xl animate-in slide-in-from-right-full text-zinc-300">
              <div className="flex items-center justify-between h-20 px-4 border-b border-zinc-800">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-amber-500 mx-2" />
                  <span className="text-xl font-bold text-amber-500">SahaCare Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="px-3 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} 
                          className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${
                            isActive ? "bg-amber-500 text-zinc-950" : "hover:bg-zinc-800 hover:text-amber-400"
                          }`}>
                          <span className="mx-3">{item.icon}</span>
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950 relative transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminContent>{children}</AdminContent>;
}
