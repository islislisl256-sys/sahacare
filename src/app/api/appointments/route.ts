import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");
    const providerId = searchParams.get("providerId");

    let query = supabaseAdmin
      .from("appointments")
      .select("*, request:service_requests(*), provider_profile:provider_profiles!provider_id(user:users!user_id(name, phone, avatar_url)), patient:users!patient_id(name, phone, avatar_url)");

    if (requestId) {
      query = query.eq("request_id", requestId).single();
      const { data, error } = await query;
      if (error) throw error;
      
      const mappedData = data ? {
        ...data,
        provider: data.provider_profile?.user || null
      } : null;
      
      return NextResponse.json({ data: mappedData });
    }

    if (providerId) {
      query = query.eq("provider_id", providerId).order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      
      const mappedData = data ? data.map((appt: any) => ({
        ...appt,
        provider: appt.provider_profile?.user || null
      })) : [];
      
      return NextResponse.json({ data: mappedData });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("Appointments API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
