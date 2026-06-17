'use client';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">إدارة المستخدمين</h2>
          <p className="text-zinc-500">متابعة حسابات المرضى والمعالجين وإدارة صلاحياتهم</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="bg-white border border-zinc-200 rounded-xl px-4 py-2 flex items-center shadow-sm w-full sm:w-64">
            <span className="text-zinc-400 ml-2">🔍</span>
            <input type="text" placeholder="ابحث بالإيميل أو الاسم..." className="outline-none bg-transparent w-full text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold">المستخدم</th>
                <th className="px-6 py-4 font-bold">نوع الحساب</th>
                <th className="px-6 py-4 font-bold">تاريخ التسجيل</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {/* User 1 */}
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">A</div>
                    <div>
                      <p className="font-bold text-zinc-900">أحمد بن فلان</p>
                      <p className="text-xs text-zinc-500">ahmed@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">مريض</span>
                </td>
                <td className="px-6 py-4 text-zinc-500">اليوم</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">نشط</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">إيقاف</button>
                </td>
              </tr>
              
              {/* User 2 */}
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">M</div>
                    <div>
                      <p className="font-bold text-zinc-900">محمد كريم</p>
                      <p className="text-xs text-zinc-500">med@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md text-xs font-bold border border-teal-100">معالج</span>
                </td>
                <td className="px-6 py-4 text-zinc-500">الأمس</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">بانتظار التوثيق</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">إيقاف</button>
                </td>
              </tr>
              
              {/* User 3 */}
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-amber-500 flex items-center justify-center font-bold">S</div>
                    <div>
                      <p className="font-bold text-zinc-900">إدارة SahaCare</p>
                      <p className="text-xs text-zinc-500">sahacare@gmail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-zinc-900 text-amber-500 rounded-md text-xs font-bold border border-amber-500/30">Admin</span>
                </td>
                <td className="px-6 py-4 text-zinc-500">منذ أسبوع</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">نشط</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-zinc-400 text-xs font-bold">حساب محمي</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
