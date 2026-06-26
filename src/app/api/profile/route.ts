import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch user basic data
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Fetch provider specific data if role is provider
    let providerProfile = null;
    const userData = user as any;
    if (userData.role === "provider") {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("provider_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (!profileError) {
        providerProfile = profile;
      }
    }

    return NextResponse.json({ user, providerProfile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const { 
      name, phone, address, avatar_url, // For users table
      specialty, bio, work_area, default_travel_cost, day_off, // For provider_profiles
      newPassword // For auth.users
    } = body;

    // 1. Update basic user data
    const { error: updateError } = await (supabaseAdmin.from("users") as any)
      .update({
        name,
        phone,
        address,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 2. Update provider profile if applicable
    if ((session.user as any).role === "provider") {
      const { error: providerUpdateError } = await (supabaseAdmin.from("provider_profiles") as any)
        .update({
          specialty,
          bio,
          work_area,
          default_travel_cost,
          day_off,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
        
      if (providerUpdateError) throw providerUpdateError;
    }

    // 3. Handle password change
    if (newPassword && newPassword.length >= 6) {
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
      });
      if (passwordError) throw passwordError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
