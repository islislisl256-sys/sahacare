'use client';

import { useState } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

export default function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "مرحباً! أنا مساعد SahaCare الذكي 🏥\nيمكنني مساعدتك في:\n• وصف الأعراض\n• اختيار الخدمة المناسبة\n• الإجابة على أسئلتك الصحية" }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    // Simulated AI response (UI only)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "شكراً على سؤالك! هذه الخاصية ستكون متاحة قريباً مع الذكاء الاصطناعي الكامل. في الوقت الراهن يمكنك طلب خدمة صحية مباشرة من قائمة الخدمات 💙"
      }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-red-400/40 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title="مساعد SahaCare الذكي"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">مساعد SahaCare</p>
                <p className="text-xs text-red-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block"></span> متاح الآن
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 min-h-48">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white rounded-tr-sm'
                    : 'bg-gradient-to-br from-red-500 to-red-600 text-white rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-red-500 to-red-600 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 text-sm outline-none border border-gray-200 dark:border-slate-700 focus:border-red-400"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
