const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
let env = '';
try { env = fs.readFileSync('.env.local', 'utf8'); } catch(e){}
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : "";
const key = keyMatch ? keyMatch[1].trim() : "";

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from("users").select("*");
  console.log("Users:", JSON.stringify(data, null, 2));
}

test();
