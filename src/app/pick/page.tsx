import { getServiceSupabase } from "@/lib/supabase-server";
import PickClient from "./PickClient";

export const dynamic = "force-dynamic";

export default async function PickPage() {
  const sb = getServiceSupabase();

  const { data: rows } = await sb
    .from("templates")
    .select("id, name, storage_path")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Generate signed preview URLs (10-min expiry).
  const templates = await Promise.all(
    (rows ?? []).map(async (t) => {
      const { data: signed } = await sb.storage
        .from("templates")
        .createSignedUrl(t.storage_path, 60 * 10);
      return { id: t.id, name: t.name, previewUrl: signed?.signedUrl ?? null };
    })
  );

  return <PickClient templates={templates} />;
}
