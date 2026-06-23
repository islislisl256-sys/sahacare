'use client';

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
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
