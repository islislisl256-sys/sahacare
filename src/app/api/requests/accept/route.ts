import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    const userId = session.user.id as string;
    
    // Validate provider role
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (!userData || userData.role !== 'provider') {
      return NextResponse.json({ error: "فقط المعالجين يمكنهم قبول الطلبات" }, { status: 403 });
    }

    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    // Check if request is still pending
    const { data: request, error: requestError } = await supabaseAdmin
      .from("service_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      return NextResponse.json({ error: "لم يتم العثور على الطلب" }, { status: 404 });
    }

    if (request.status !== 'pending') {
      return NextResponse.json({ error: "هذا الطلب لم يعد متاحاً للقبول" }, { status: 400 });
    }

    // 1. Update request status to 'accepted'
    const { error: updateError } = await (supabaseAdmin.from("service_requests") as any)
      .update({ status: 'accepted' })
      .eq("id", requestId);

    if (updateError) {
      throw new Error("فشل تحديث حالة الطلب: " + updateError.message);
    }

    // 2. Create an appointment
    const { data: appointment, error: apptError } = await (supabaseAdmin.from("appointments") as any)
      .insert({
        request_id: requestId,
        patient_id: request.patient_id,
        provider_id: userId,
        status: 'scheduled',
      })
      .select()
      .single();

    if (apptError) {
      // Revert request status if appointment fails
      await (supabaseAdmin.from("service_requests") as any).update({ status: 'pending' }).eq("id", requestId);
      throw new Error("فشل إنشاء الموعد: " + apptError.message);
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    console.error("Accept request error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ داخلي" }, { status: 500 });
  }
}
