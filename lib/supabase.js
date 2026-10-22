import { createClient } from "@supabase/supabase-js";

// The URL and anon key are public by design (Supabase protects data with the
// row-level security rules in supabase/setup.sql). They are set in the deploy
// workflow, and in .env.local when testing locally.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client;

// Browser-only; returns null until Supabase is configured.
export function getSupabase() {
  if (!url || !anonKey || typeof window === "undefined") return null;
  client ??= createClient(url, anonKey, {
    auth: { flowType: "pkce", persistSession: true, detectSessionInUrl: true },
  });
  return client;
}
