'use client';

import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
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
