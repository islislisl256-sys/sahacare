'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "sahacare@gmail.com", // الإيميل الثابت
        password: passwordOne,
        adminPassword: passwordTwo,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء محاولة الدخول");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>دخول الإدارة المركزية | SahaCare</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-300 transition-colors" dir="rtl">
        <div className="bg-white dark:bg-black p-8 sm:p-10 rounded-3xl shadow-2xl shadow-amber-900/10 dark:shadow-amber-900/20 text-center w-full max-w-md border border-zinc-200 dark:border-zinc-800 relative overflow-hidden transition-colors">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-amber-500 border border-zinc-200 dark:border-zinc-700 shadow-inner">
              <ShieldAlert className="w-10 h-10" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">بوابة الإدارة المركزية</h1>
          <p className="mb-8 text-sm text-zinc-500 font-medium">Sahacare@gmail.com</p>
          
          {error && <div className="text-rose-600 dark:text-rose-500 mb-6 font-bold bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-3 rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-right">
            <div>
              <label className="block mb-2 text-zinc-600 dark:text-zinc-400 font-bold text-sm">كلمة المرور الأولى</label>
              <input
                type="password"
                required
                value={passwordOne}
                onChange={(e) => setPasswordOne(e.target.value)}
                placeholder="••••••"
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-zinc-900 dark:text-white font-mono tracking-widest text-center"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-zinc-600 dark:text-zinc-400 font-bold text-sm">كلمة المرور الثانية</label>
              <input
                type="password"
                required
                value={passwordTwo}
                onChange={(e) => setPasswordTwo(e.target.value)}
                placeholder="••••••"
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-zinc-900 dark:text-white font-mono tracking-widest text-center"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full p-4 bg-amber-500 text-zinc-950 rounded-xl font-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول للإدارة"}
            </button>
          </form>

          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <Link href="/" className="text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" /> العودة للموقع
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
