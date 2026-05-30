import { getServiceSupabase } from "@/lib/supabase-server";
import PickClient from "./PickClient";

export const dynamic = "force-dynamic";

export default async function PickPage() {
  // Graceful fallback if Supabase isn't configured yet
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return <PickClient templates={[]} />;
  }

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
