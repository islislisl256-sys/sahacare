import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";

export default function SignUp() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ أثناء إنشاء الحساب");
      }

      router.push("/auth/signin?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("signup")} | SahaCare</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden p-4">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent dark:from-indigo-900/20"></div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl text-center w-full max-w-md relative z-10 border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img src="/sahacare.jpg" alt="SahaCare Logo" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-sm border-2 border-teal-100 dark:border-slate-700" />
          </div>
          <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">{t("signup")}</h1>
          
          {error && <div className="text-red-600 dark:text-red-400 mb-4 font-medium bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-right">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("email_label")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-2xl border border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 outline-none transition-all bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("password_label")}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-2xl border border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 outline-none transition-all bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("confirm_password_label")}</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-2xl border border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 outline-none transition-all bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("account_type")}</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${role === 'patient' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="role" value="patient" checked={role === 'patient'} onChange={(e) => setRole(e.target.value)} className="hidden" />
                  مريض
                </label>
                <label className={`flex-1 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${role === 'provider' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="role" value="provider" checked={role === 'provider'} onChange={(e) => setRole(e.target.value)} className="hidden" />
                  {t("provider")}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loading ? t("creating_account") : t("signup")}
            </button>
          </form>

          <div className="mt-6 text-gray-600 dark:text-gray-400">
            {t("have_account")} <Link href="/auth/signin" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{t("signin")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
