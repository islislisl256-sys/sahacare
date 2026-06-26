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

    const { offerId, price, message } = await req.json();

    if (!offerId || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    // 1. Fetch the offer to verify ownership and get request_id
    const { data: offer, error: offerError } = await supabaseAdmin
      .from("offers")
      .select("*, request:service_requests(patient_id)")
      .eq("id", offerId)
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    let newStatus = "";

    if (role === "patient") {
      // Verify patient owns the request
      if (offer.request?.patient_id !== userId) {
        return NextResponse.json({ error: "Unauthorized to counter this offer" }, { status: 403 });
      }
      newStatus = "countered_by_patient";
    } else if (role === "provider") {
      // Verify provider owns the offer
      if (offer.provider_id !== userId) {
        return NextResponse.json({ error: "Unauthorized to counter this offer" }, { status: 403 });
      }
      newStatus = "countered_by_provider";
    } else {
      return NextResponse.json({ error: "Invalid role for negotiation" }, { status: 403 });
    }

    // 2. Update offer price, message, and status
    const { data: updatedOffer, error: updateError } = await supabaseAdmin
      .from("offers")
      .update({
        price,
        message: message || offer.message, // keep old message if new one is empty
        status: newStatus
      })
      .eq("id", offerId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, data: updatedOffer });
  } catch (error: any) {
    console.error("Counter offer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
