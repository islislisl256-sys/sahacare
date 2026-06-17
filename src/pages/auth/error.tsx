import { useRouter } from "next/router";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
        حدث خطأ في المصادقة
      </h1>
      <p className="mb-6 text-center text-lg text-gray-700 dark:text-gray-300 max-w-xl">
        {error ? decodeURIComponent(error as string) : "خطأ غير معروف"}
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        العودة إلى الصفحة الرئيسية
      </button>
    </div>
  );
}
