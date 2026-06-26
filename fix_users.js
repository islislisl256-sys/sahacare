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
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.log("Auth Error:", authError);
    return;
  }
  console.log("Found", authUsers.users.length, "auth users.");

  for (const u of authUsers.users) {
    let role = u.user_metadata?.role || "patient";
    
    // Explicitly make the other account a provider if it's not the islam one
    if (u.email !== "islam@gmail.com") {
      role = "provider";
    }

    const { error: upsertError } = await supabase.from("users").upsert({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || "مستخدم",
      role: role
    });

    if (upsertError) {
      console.log("Error upserting user", u.email, upsertError);
    } else {
      console.log("Upserted user", u.email, "as", role);
    }

    await supabase.auth.admin.updateUserById(u.id, { user_metadata: { role } });
  }
}

fix();
