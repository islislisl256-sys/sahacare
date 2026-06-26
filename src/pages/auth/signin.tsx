import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-slate-950">
        <p className="text-gray-500 dark:text-gray-400 font-bold">{t("logging_in")}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>{t("signin")} | SahaCare</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden p-4">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent dark:from-indigo-900/20"></div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl text-center w-full max-w-md relative z-10 border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img src="/sahacare.jpg" alt="SahaCare Logo" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-sm border-2 border-indigo-100 dark:border-slate-700" />
          </div>
          <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">{t("signin")}</h1>
          
          {error && <div className="text-red-600 dark:text-red-400 mb-4 font-medium bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">{error}</div>}
          {router.query.registered && <div className="text-green-600 dark:text-green-400 mb-4 font-medium bg-green-50 dark:bg-green-500/10 p-3 rounded-xl">تم إنشاء الحساب بنجاح، يرجى تسجيل الدخول.</div>}

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

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loading ? t("logging_in") : t("signin")}
            </button>
          </form>

          <div className="mt-6 text-gray-600 dark:text-gray-400">
            {t("no_account")} <Link href="/auth/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{t("signup")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}

