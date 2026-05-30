import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

// Public endpoint: returns { url } for the currently-active template, or {} if none.
export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({}, { status: 200 });
  }
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("templates")
    .select("storage_path")
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (error || !data) return NextResponse.json({}, { status: 200 });
  const { data: signed } = await sb.storage.from("templates").createSignedUrl(data.storage_path, 60 * 10);
  return NextResponse.json({ url: signed?.signedUrl ?? null });
}
