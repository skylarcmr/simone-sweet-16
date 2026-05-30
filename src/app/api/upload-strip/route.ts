import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

// Uploads a finished strip PNG and returns { id, publicUrl }.
// `id` is the short URL slug used by /d/[id]. We also persist a row in `strips`
// so the download page can resolve the slug to a storage path.
export async function POST(req: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "no file" }, { status: 400 });

  const sb = getServiceSupabase();
  // Short, URL-safe ID for the public link (8 chars of base32-ish randomness).
  const id = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map(b => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31])
    .join("");
  const path = `${new Date().toISOString().slice(0, 10)}/${id}.png`;
  const ab = await file.arrayBuffer();

  const { error: upErr } = await sb.storage.from("strips").upload(path, ab, {
    contentType: "image/png",
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { error: dbErr } = await sb.from("strips").insert({
    id,
    storage_path: path,
  });
  if (dbErr) {
    await sb.storage.from("strips").remove([path]);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  const { data: pub } = sb.storage.from("strips").getPublicUrl(path);
  return NextResponse.json({ id, publicUrl: pub.publicUrl });
}
