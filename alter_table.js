const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
let env = '';
try { env = fs.readFileSync('.env.local', 'utf8'); } catch(e){}
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : "";
const key = keyMatch ? keyMatch[1].trim() : "";

const supabaseAdmin = createClient(url, key);

async function alterTable() {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
    sql: 'ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION; ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION;' 
  });
  
  if (error) {
    console.log("RPC Error, trying standard postgrest...", error.message);
    // If RPC doesn't exist, we can't alter table via REST API. We'll have to just assume the user will do it, 
    // or we can use a workaround: we can't execute raw SQL without a custom RPC function in Supabase.
  }
}

alterTable();
