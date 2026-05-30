import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

// Returns { url } for a template by id (preferred), or first active template fallback.
export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({}, { status: 200 });
  }
  const id = req.nextUrl.searchParams.get("id");
  const sb = getServiceSupabase();

  let row;
  if (id) {
    const { data } = await sb
      .from("templates")
      .select("storage_path")
      .eq("id", id)
      .eq("active", true)
      .maybeSingle();
    row = data;
  }
  // Fallback: first active template if id missing or not found
  if (!row) {
    const { data } = await sb
      .from("templates")
      .select("storage_path")
      .eq("active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    row = data;
  }
  if (!row) return NextResponse.json({}, { status: 200 });
  const { data: signed } = await sb.storage.from("templates").createSignedUrl(row.storage_path, 60 * 10);
  return NextResponse.json({ url: signed?.signedUrl ?? null });
}
