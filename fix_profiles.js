const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
let env = '';
try { env = fs.readFileSync('.env.local', 'utf8'); } catch(e){}
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : "";
const key = keyMatch ? keyMatch[1].trim() : "";

const supabase = createClient(url, key);

async function fix() {
  const { data: users, error: usersError } = await supabase.from("users").select("*").eq("role", "provider");
  if (usersError) {
    console.log("Error:", usersError);
    return;
  }

  for (const u of users) {
    const { error: profileError } = await supabase.from("provider_profiles").upsert({
      user_id: u.id,
      specialty: "معالج عام"
    });

    if (profileError) {
      console.log("Error upserting profile for", u.email, profileError);
    } else {
      console.log("Upserted profile for", u.email);
    }
  }
}

fix();
