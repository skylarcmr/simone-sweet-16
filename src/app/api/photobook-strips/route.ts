import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

// Public endpoint: list all strips users have opted in to the photobook.
// Returns [{ id, url, created_at }]
export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ strips: [] });
  }
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("strips")
    .select("id,storage_path,created_at")
    .eq("photobook", true)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ strips: [], error: error.message }, { status: 500 });

  const strips = (data ?? []).map((s) => {
    const { data: pub } = sb.storage.from("strips").getPublicUrl(s.storage_path);
    return { id: s.id, url: pub.publicUrl, created_at: s.created_at };
  });
  return NextResponse.json({ strips });
}
