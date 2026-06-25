import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

// Admin client that bypasses RLS
// Make sure to add SUPABASE_SERVICE_ROLE_KEY to your .env.local
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
