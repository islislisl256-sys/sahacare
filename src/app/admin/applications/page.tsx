'use client';
import { FileText, XCircle } from "lucide-react";

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">طلبات انضمام المعالجين</h2>
          <p className="text-zinc-500">مراجعة وثائق المعالجين الجدد وتفعيل حساباتهم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Application 1 */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-2xl border border-teal-100 flex-shrink-0">
            M
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-zinc-900">محمد كريم</h3>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-xs font-bold border border-amber-200">ينتظر المراجعة</span>
            </div>
            <p className="text-zinc-500 text-sm mb-3">طبيب عام • الجزائر العاصمة • سجل منذ 24 ساعة</p>
            <div className="flex gap-4">
              <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-bold">
                <FileText className="w-4 h-4" /> عرض الشهادة الجامعية (PDF)
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-bold">
                <FileText className="w-4 h-4" /> رخصة مزاولة المهنة (JPG)
              </a>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm">
              قبول وتفعيل
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-zinc-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors">
              رفض
            </button>
          </div>
        </div>

        {/* Application 2 */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-2xl border border-purple-100 flex-shrink-0">
            S
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-zinc-900">سارة بن علي</h3>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-md text-xs font-bold border border-red-200">وثائق ناقصة</span>
            </div>
            <p className="text-zinc-500 text-sm mb-3">ممرضة رعاية منزلية • وهران • سجلت منذ 3 أيام</p>
            <div className="flex gap-4">
              <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-bold">
                <FileText className="w-4 h-4" /> عرض الشهادة الجامعية (PDF)
              </a>
              <span className="flex items-center gap-2 text-sm text-red-500 font-bold">
                <XCircle className="w-4 h-4" /> رخصة المزاولة غير متوفرة
              </span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold hover:bg-zinc-50 transition-colors">
              مراسلة لطلب الوثائق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
