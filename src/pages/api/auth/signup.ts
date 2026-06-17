import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, role = "patient" } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
  }

  // إنشاء حساب في Supabase
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    });

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(400).json({ error: error.message, details: error });
    }

    // الاعتماد بالكامل على user_metadata التي تم إعدادها أثناء إنشاء الحساب في الخطوة السابقة
    // لم نعد بحاجة إلى الإضافة في جدول users لتجنب مشاكل RLS وأخطاء الـ Types

    return res.status(200).json({ message: "تم إنشاء الحساب بنجاح", user: data.user });
  } catch (e: any) {
    console.error("Catch Exception:", e);
    return res.status(500).json({ error: "Server exception", details: e.message });
  }
}
