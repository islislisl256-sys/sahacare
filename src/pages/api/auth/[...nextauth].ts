import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email", placeholder: "example@example.com" },
        password: { label: "كلمة المرور", type: "password" },
        adminPassword: { label: "كلمة المرور الثانية (للإدارة فقط)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // نظام الدخول الخاص بالإدارة (يتجاهل قاعدة البيانات تماماً)
        if (credentials.email.toLowerCase() === "sahacare@gmail.com") {
          if (credentials.password === "123456" && credentials.adminPassword === "654321") {
            return {
              id: "super-admin-id",
              email: "sahacare@gmail.com",
              name: "المدير العام",
              role: "admin",
            };
          } else {
            throw new Error("بيانات الإدارة غير صحيحة");
          }
        }

        // التحقق من صحة بيانات الدخول عبر Supabase للمستخدمين العاديين
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (authError || !authData.user) {
          console.error("Supabase signin error:", authError);
          return null;
        }

        // جلب دور المستخدم من user_metadata الخاص بـ Supabase Auth
        // وهذا يحل مشكلة الـ RLS التي تمنع قراءة جدول users
        let role = authData.user.user_metadata?.role || "patient";

        // محاولة إضافية للقراءة من جدول users لو أمكن
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (userData && !userError && userData.role) {
          role = userData.role;
        }

        return {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || null,
          role: role,
        };
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (!session.user) session.user = {} as any;
      (session.user as any).id = token.sub;
      (session.user as any).role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
};

export default NextAuth(authOptions);

