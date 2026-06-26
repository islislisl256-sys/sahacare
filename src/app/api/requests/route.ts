import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patientId = (session.user as any).id;
    const body = await req.json();

    const { 
      serviceType, 
      description, 
      budget, 
      locationLat, 
      locationLng, 
      addressText, 
      prescriptionUrl 
    } = body;

    // Ensure user exists in public.users to prevent foreign key constraint errors
    // if they signed up before the database triggers were created.
    const { error: userError } = await (supabaseAdmin.from("users") as any)
      .upsert({
        id: patientId,
        email: session.user.email,
        name: session.user.name || "مستخدم",
        role: "patient"
      }, { onConflict: "id" });
      
    if (userError) {
      console.warn("Could not upsert user, proceeding anyway:", userError);
    }

    const { data, error } = await (supabaseAdmin.from("service_requests") as any)
      .insert({
        patient_id: patientId,
        service_type: serviceType,
        description,
        budget: budget || null,
        location_lat: locationLat,
        location_lng: locationLng,
        address_text: addressText,
        prescription_url: prescriptionUrl || null,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Return the specific error message to the client for debugging
      return NextResponse.json({ error: "DB Error: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Request API error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ غير معروف" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    // Fetch fresh role from DB to avoid NextAuth token caching issues during dev
    let role = (session.user as any).role;
    const { data: userData } = await supabaseAdmin.from("users").select("role").eq("id", userId).single();
    if (userData && (userData as any).role) {
      role = (userData as any).role;
    }
    
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    let data, error;

    if (role === "patient") {
      const res = await supabaseAdmin.from("service_requests").select("*, patient:users(name, avatar_url, phone)")
        .eq("patient_id", userId).order('created_at', { ascending: false });
      data = res.data; error = res.error;
    } else if (role === "provider") {
      const res = await supabaseAdmin.from("service_requests").select("*, patient:users(name, avatar_url, phone)")
        .eq("status", "pending").order('created_at', { ascending: false });
      data = res.data; error = res.error;
    } else {
      const res = await supabaseAdmin.from("service_requests").select("*, patient:users(name, avatar_url, phone)")
        .order('created_at', { ascending: false });
      data = res.data; error = res.error;
    }

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
