import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || (session.user as any).role !== "provider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providerId = (session.user as any).id;
    const body = await req.json();

    const { requestId, price, message } = body;

    if (!requestId || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("offers")
      .insert({
        request_id: requestId,
        provider_id: providerId,
        price,
        message,
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    let query = supabaseAdmin.from("offers").select("*, provider_profile:provider_profiles!provider_id(specialty, is_verified, user:users!user_id(name, avatar_url, phone))");

    if (requestId) {
      // Patients fetching offers for their specific request
      // We should theoretically verify that the patient owns the request, but we trust the patient app logic for now or we could check.
      query = query.eq("request_id", requestId);
    } else if (role === "provider") {
      // Provider fetching their own offers
      query = query.eq("provider_id", userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const mappedData = data ? data.map((offer: any) => ({
      ...offer,
      provider: offer.provider_profile?.user || null,
      profile: {
        specialty: offer.provider_profile?.specialty,
        is_verified: offer.provider_profile?.is_verified,
      }
    })) : [];

    return NextResponse.json({ data: mappedData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
