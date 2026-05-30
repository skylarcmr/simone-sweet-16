"use server";
import { redirect } from "next/navigation";
import { getServerSupabase, getServiceSupabase, isAdminEmail } from "@/lib/supabase-server";

async function requireAdmin() {
  const sb = await getServerSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");
  return user;
}

export async function uploadTemplate(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const file = formData.get("file");
  if (!name || !(file instanceof Blob)) return { error: "name and file required" };

  const service = getServiceSupabase();
  const path = `${crypto.randomUUID()}.png`;
  const ab = await file.arrayBuffer();
  const { error: upErr } = await service.storage
    .from("templates")
    .upload(path, ab, { contentType: "image/png", upsert: false });
  if (upErr) return { error: upErr.message };

  // Default to AVAILABLE on guest picker
  const { error: dbErr } = await service.from("templates").insert({
    name,
    storage_path: path,
    active: true,
  });
  if (dbErr) {
    await service.storage.from("templates").remove([path]);
    return { error: dbErr.message };
  }
  return { ok: true };
}

// Toggle whether this template is shown to guests on the /pick page.
// Multiple templates can be available simultaneously.
export async function toggleTemplate(id: string, active: boolean) {
  await requireAdmin();
  const service = getServiceSupabase();
  await service.from("templates").update({ active }).eq("id", id);
}

export async function deleteTemplate(id: string) {
  await requireAdmin();
  const service = getServiceSupabase();
  const { data } = await service.from("templates").select("storage_path").eq("id", id).maybeSingle();
  if (data?.storage_path) await service.storage.from("templates").remove([data.storage_path]);
  await service.from("templates").delete().eq("id", id);
}

export async function signOut() {
  const sb = await getServerSupabase();
  await sb.auth.signOut();
  redirect("/admin/login");
}
