'use client';

export default function Appointments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المواعيد</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          + حجز موعد جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 text-center text-gray-500 py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد مواعيد</h3>
          <p>ليس لديك أي مواعيد قادمة أو سابقة مسجلة في النظام.</p>
        </div>
      </div>
    </div>
  );
}
