import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// Magic-link callback: exchange the auth code for a session cookie, then redirect.
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";
  if (code) {
    const sb = await getServerSupabase();
    await sb.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(`${origin}${next}`);
}
