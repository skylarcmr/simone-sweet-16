import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

// Public endpoint: guest tells us whether to save their strip in the photobook.
// POST { id: string, save: boolean }
export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  let body: { id?: string; save?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : null;
  const save = body.save === true;
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

  const sb = getServiceSupabase();
  const { error } = await sb.from("strips").update({ photobook: save }).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
