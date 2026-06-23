'use client';

import { useState } from "react";
import { Clock, CheckCircle2, XCircle, Activity, Brain, Baby, TestTube2, ChevronLeft } from "lucide-react";

const SERVICE_ICONS: Record<string, JSX.Element> = {
  "physical-therapy": <Activity className="w-5 h-5" />,
  "psychiatry": <Brain className="w-5 h-5" />,
  "pediatrics": <Baby className="w-5 h-5" />,
  "lab-tests": <TestTube2 className="w-5 h-5" />,
};

const SERVICE_LABELS: Record<string, string> = {
  "physical-therapy": "علاج طبيعي",
  "psychiatry": "حصة مع طبيب نفسي",
  "pediatrics": "حصة مع طبيب أطفال",
  "lab-tests": "تحاليل طبية",
};

const STATUS_CONFIG = {
  pending: { label: "قيد المراجعة", icon: <Clock className="w-4 h-4" />, color: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" },
  confirmed: { label: "مؤكد", icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30" },
  completed: { label: "مكتمل", icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30" },
  cancelled: { label: "ملغي", icon: <XCircle className="w-4 h-4" />, color: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30" },
};

// Demo data
const DEMO_REQUESTS = [
  { id: 1, type: "lab-tests", status: "pending", date: "2026-07-01", time: "10:00", address: "شارع العروبة، الرياض", notes: "تحليل شامل + صورة دم" },
  { id: 2, type: "physical-therapy", status: "confirmed", date: "2026-06-28", time: "14:30", address: "شارع الملك فهد، الرياض", notes: "" },
  { id: 3, type: "psychiatry", status: "completed", date: "2026-06-20", time: "09:00", address: "شارع التحلية، جدة", notes: "جلسة متابعة" },
];

export default function MyRequestsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");

  const filtered = DEMO_REQUESTS.filter(r => filter === "all" || r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">طلباتي 📋</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">تابع جميع طلبات الخدمات الصحية الخاصة بك</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "الكل" },
          { key: "pending", label: "قيد المراجعة" },
          { key: "confirmed", label: "مؤكدة" },
          { key: "completed", label: "مكتملة" },
          { key: "cancelled", label: "ملغاة" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              filter === tab.key
                ? "bg-red-600 text-white shadow"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-red-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">لا توجد طلبات في هذه الفئة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const status = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
            return (
              <div key={req.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                      {SERVICE_ICONS[req.type]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{SERVICE_LABELS[req.type]}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        📅 {req.date} &nbsp;⏰ {req.time}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
                {(req.address || req.notes) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-1.5">
                    {req.address && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-2">
                        📍 {req.address}
                      </p>
                    )}
                    {req.notes && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-2">
                        📝 {req.notes}
                      </p>
                    )}
                  </div>
                )}
                {req.status === "pending" && (
                  <div className="mt-3">
                    <button className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">
                      إلغاء الطلب
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
