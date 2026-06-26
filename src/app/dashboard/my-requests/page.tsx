'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle2, XCircle, Activity, Brain, Baby, TestTube2, ChevronLeft, Loader2, Inbox, Calendar, MapPin, DollarSign, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "physical-therapy": <Activity className="w-5 h-5" />,
  "psychiatry": <Brain className="w-5 h-5" />,
  "pediatrics": <Baby className="w-5 h-5" />,
  "lab-tests": <TestTube2 className="w-5 h-5" />,
};

export default function MyRequestsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Build service labels using translations
  const SERVICE_LABELS: Record<string, string> = {
    "physical-therapy": t("service_physical_therapy"),
    "psychiatry": t("service_psychiatry"),
    "pediatrics": t("service_pediatrics"),
    "lab-tests": t("service_lab_tests"),
  };

  const STATUS_CONFIG = {
    pending:   { label: t("status_pending"),          icon: <Clock className="w-4 h-4" />,         color: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" },
    confirmed: { label: t("status_confirmed"),        icon: <CheckCircle2 className="w-4 h-4" />,  color: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30" },
    completed: { label: t("status_completed_label"),  icon: <CheckCircle2 className="w-4 h-4" />,  color: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30" },
    cancelled: { label: t("status_cancelled"),        icon: <XCircle className="w-4 h-4" />,       color: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30" },
    accepted:  { label: t("status_confirmed") || "مقبول",       icon: <CheckCircle2 className="w-4 h-4" />,  color: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30" }
  };

  const FILTER_TABS = [
    { key: "all",       label: t("filter_all") },
    { key: "pending",   label: t("filter_pending") },
    { key: "confirmed", label: t("filter_confirmed") },
    { key: "completed", label: t("filter_completed") },
    { key: "cancelled", label: t("filter_cancelled") },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests");
        const json = await res.json();
        if (json.data) {
          setRequests(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = requests.filter(r => filter === "all" || r.status === filter || (filter === "confirmed" && r.status === "accepted"));

  const handleRequestClick = (req: any) => {
    if (req.status === "pending") {
      // Go to request details and offers page
      router.push(`/dashboard/my-requests/${req.id}`);
    } else if (req.status === "completed" || req.status === "confirmed" || req.status === "accepted") {
      router.push(`/dashboard/treatments/${req.id}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{t("my_requests_title")}</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">{t("my_requests_desc")}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(tab => (
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
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-full">
            <Inbox className="w-12 h-12" />
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">{t("no_requests_in_category")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const statusConfig = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
            const dateStr = new Date(req.created_at).toLocaleDateString('ar-DZ');
            const timeStr = new Date(req.created_at).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={req.id}
                onClick={() => handleRequestClick(req)}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {SERVICE_ICONS[req.service_type] || <Activity className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {SERVICE_LABELS[req.service_type] || req.service_type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {dateStr} &nbsp; <Clock className="w-3 h-3" /> {timeStr}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                    {(req.status === "completed" || req.status === "confirmed" || req.status === "accepted") && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("details")} <ChevronLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
                {(req.address_text || req.description || req.budget) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-1.5">
                    {req.address_text && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" /> {req.address_text}
                      </p>
                    )}
                    {req.budget && (
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> الميزانية: {req.budget} دج
                      </p>
                    )}
                    {req.description && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" /> <span className="whitespace-pre-line">{req.description}</span>
                      </p>
                    )}
                  </div>
                )}
                {req.status === "pending" && (
                  <div className="mt-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add cancellation logic here if needed
                        alert("سيتم إلغاء الطلب (لم يتم برمجته بعد)");
                      }}
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                    >
                      {t("cancel_request")}
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
