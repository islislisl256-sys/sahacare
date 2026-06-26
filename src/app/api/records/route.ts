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
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("medical_records")
      .select("*")
      .eq("appointment_id", appointmentId)
      .maybeSingle(); // maybeSingle because it might not exist yet

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Records API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || (session.user as any).role !== "provider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId, patientId, notes, fileUrl } = await req.json();
    const providerId = (session.user as any).id;

    if (!appointmentId || !patientId || !notes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await (supabaseAdmin.from("medical_records") as any)
      .insert({
        appointment_id: appointmentId,
        patient_id: patientId,
        provider_id: providerId,
        notes,
        file_url: fileUrl || null
      })
      .select()
      .single();

    if (error) throw error;

    // Mark appointment and request as completed
    await (supabaseAdmin.from("appointments") as any).update({ status: 'completed' }).eq("id", appointmentId);
    
    // Get the request id from the appointment to update it
    const { data: appt } = await supabaseAdmin.from("appointments").select("request_id").eq("id", appointmentId).single();
    if (appt) {
      await (supabaseAdmin.from("service_requests") as any).update({ status: 'completed' }).eq("id", appt.request_id);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Records POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
