import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, name, email, phone, avatar_url, role")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("provider_profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    // It's okay if profile doesn't exist for some reason, we just return the user basic info
    return NextResponse.json({ data: { ...(user as any), profile: profile || null } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
