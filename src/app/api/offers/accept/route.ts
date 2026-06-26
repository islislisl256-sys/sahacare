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

    const { offerId } = await req.json();

    // 1. Fetch the offer to get request_id and provider_id
    const { data: offer, error: offerError } = await supabaseAdmin
      .from("offers")
      .select("*, request:service_requests(patient_id)")
      .eq("id", offerId)
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const offerData = offer as any;
    const requestId = offerData.request_id;
    const providerId = offerData.provider_id;
    const patientId = offerData.request?.patient_id;

    if (!patientId) {
      return NextResponse.json({ error: "Could not find patient ID" }, { status: 400 });
    }

    // 2. Update offer status to 'accepted'
    await (supabaseAdmin.from("offers") as any)
      .update({ status: 'accepted' })
      .eq("id", offerId);

    // Reject other offers for this request
    await (supabaseAdmin.from("offers") as any)
      .update({ status: 'rejected' })
      .eq("request_id", requestId)
      .neq("id", offerId);

    // 3. Update request status to 'accepted'
    await (supabaseAdmin.from("service_requests") as any)
      .update({ status: 'accepted' })
      .eq("id", requestId);

    // 4. Create an appointment/case
    const { data: appointment, error: apptError } = await (supabaseAdmin.from("appointments") as any)
      .insert({
        request_id: requestId,
        patient_id: patientId,
        provider_id: providerId,
        offer_id: offerId,
        status: "scheduled"
      })
      .select()
      .single();

    if (apptError) throw apptError;

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    console.error("Accept offer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
