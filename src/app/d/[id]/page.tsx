import { notFound } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase-server";
import DownloadClient from "./DownloadClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function DownloadPage({ params }: Props) {
  const { id } = await params;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return notFound();
  if (!/^[a-z2-9]{6,12}$/.test(id)) return notFound();

  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("strips")
    .select("storage_path,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return notFound();

  const { data: pub } = sb.storage.from("strips").getPublicUrl(data.storage_path);
  return <DownloadClient imageUrl={pub.publicUrl} stripId={id} />;
}
