'use client';

import { RefreshCw, Users, UserRoundCog, Activity, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">مركز القيادة والإحصائيات</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">نظرة عامة على نشاط منصة SahaCare اليوم</p>
        </div>
        <button className="flex items-center gap-2 bg-black dark:bg-amber-500 text-amber-500 dark:text-black border border-amber-500/30 px-6 py-2.5 rounded-xl font-bold hover:bg-zinc-900 dark:hover:bg-amber-400 transition-colors shadow-lg">
          <RefreshCw className="w-4 h-4" /> تحديث البيانات
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform opacity-50"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold mb-1">إجمالي المرضى</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">1,248</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 text-sm font-bold text-green-600 relative z-10 flex items-center gap-1">
            <span>↑ 12%</span> <span className="text-zinc-400 font-medium">هذا الشهر</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal-50 dark:bg-teal-500/10 rounded-full group-hover:scale-150 transition-transform opacity-50"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold mb-1">المعالجين المعتمدين</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">342</h3>
            </div>
            <div className="bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-3 rounded-xl">
              <UserRoundCog className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 text-sm font-bold text-green-600 relative z-10 flex items-center gap-1">
            <span>↑ 5%</span> <span className="text-zinc-400 font-medium">هذا الشهر</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full group-hover:scale-150 transition-transform opacity-50"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold mb-1">الطلبات المفتوحة</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">89</h3>
            </div>
            <div className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 text-sm font-bold text-rose-600 relative z-10 flex items-center gap-1">
            <span>↓ 2%</span> <span className="text-zinc-400 font-medium">مقارنة بالأمس</span>
          </div>
        </div>

        <div className="bg-zinc-950 dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-zinc-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-amber-500/80 text-sm font-bold mb-1">الإيرادات المتوقعة</p>
              <h3 className="text-3xl font-black text-white">45M <span className="text-sm text-zinc-500 font-normal">د.ج</span></h3>
            </div>
            <div className="bg-amber-500/20 text-amber-500 p-3 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 text-sm font-bold text-green-400 relative z-10 flex items-center gap-1">
            <span>↑ 24%</span> <span className="text-zinc-500 font-medium">هذا الشهر</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">النشاطات الأخيرة للمنصة</h3>
        <div className="space-y-6">
          {/* Activity 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold border-2 border-white dark:border-zinc-900 shadow-sm z-10">جديد</div>
              <div className="w-0.5 h-full bg-zinc-100 dark:bg-zinc-800 mt-2"></div>
            </div>
            <div className="pb-6">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">انضمام معالج جديد (طبيب عام)</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">د. محمد كريم قام برفع وثائقه وينتظر التفعيل.</p>
              <p className="text-xs text-zinc-400 mt-2 font-bold">منذ 15 دقيقة</p>
            </div>
          </div>

          {/* Activity 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border-2 border-white dark:border-zinc-900 shadow-sm z-10">طلب</div>
              <div className="w-0.5 h-full bg-zinc-100 dark:bg-zinc-800 mt-2"></div>
            </div>
            <div className="pb-6">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">طلب خدمة جديد تم إنشاؤه بقيمة 5000 د.ج</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">طلب المريض (أحمد) خدمة تأهيل حركي في وهران.</p>
              <p className="text-xs text-zinc-400 mt-2 font-bold">منذ ساعتين</p>
            </div>
          </div>

          {/* Activity 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold border-2 border-white dark:border-zinc-900 shadow-sm z-10">تنبيه</div>
            </div>
            <div>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">تنبيه بالنظام: ضغط عالي في الطلبات المفتوحة</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">هناك 15 طلب خدمة في قسنطينة لم يتلقوا أي عروض منذ 24 ساعة.</p>
              <p className="text-xs text-zinc-400 mt-2 font-bold">منذ 5 ساعات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
