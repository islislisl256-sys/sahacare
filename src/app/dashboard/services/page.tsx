'use client';

import Link from "next/link";
import { Activity, Brain, Baby, TestTube2, ArrowLeft } from "lucide-react";

const services = [
  {
    id: "physical-therapy",
    icon: <Activity className="w-8 h-8" />,
    label: "علاج طبيعي",
    desc: "جلسات علاج فيزيائي في المنزل مع متخصص معتمد",
    color: "from-blue-500 to-blue-700",
    light: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
    iconBg: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "psychiatry",
    icon: <Brain className="w-8 h-8" />,
    label: "حصة مع طبيب نفسي",
    desc: "جلسة استشارية مع طبيب نفسي متخصص في المنزل",
    color: "from-purple-500 to-purple-700",
    light: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20",
    iconBg: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
  },
  {
    id: "pediatrics",
    icon: <Baby className="w-8 h-8" />,
    label: "حصة مع طبيب أطفال",
    desc: "زيارة طبية متخصصة للأطفال في المنزل",
    color: "from-green-500 to-green-700",
    light: "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20",
    iconBg: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400",
  },
  {
    id: "lab-tests",
    icon: <TestTube2 className="w-8 h-8" />,
    label: "تحاليل طبية",
    desc: "أخذ العينات وإجراء التحاليل في المنزل",
    color: "from-red-500 to-red-700",
    light: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20",
    iconBg: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400",
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">الخدمات الصحية 🏥</h2>
        <p className="text-gray-500 dark:text-slate-400">اختر الخدمة التي تحتاجها وسنرسل لك المتخصص المناسب إلى منزلك</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/dashboard/services/request?type=${service.id}`}
            className={`group flex flex-col p-6 rounded-3xl border-2 ${service.light} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${service.iconBg} transition-transform group-hover:scale-110`}>
              {service.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.label}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 flex-1">{service.desc}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
              طلب الخدمة <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
