import { redirect } from "next/navigation";
import { getServerSupabase, getServiceSupabase, isAdminEmail } from "@/lib/supabase-server";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

type Template = {
  id: string;
  name: string;
  storage_path: string;
  active: boolean;
  created_at: string;
};

type PhotobookStrip = {
  id: string;
  storage_path: string;
  created_at: string;
  url: string;
};

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <SetupBanner />;
  }

  const sb = await getServerSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  if (!isAdminEmail(user.email)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="font-display text-2xl tracking-widest uppercase">Not Authorized</h1>
          <p className="text-[var(--color-ink-soft)]">
            <code>{user.email}</code> is not on the admin allowlist.
          </p>
          <form action="/auth/sign-out" method="post">
            <button className="text-xs uppercase tracking-[0.3em] underline">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  const service = getServiceSupabase();

  const { data: tplData } = await service
    .from("templates")
    .select("id,name,storage_path,active,created_at")
    .order("created_at", { ascending: false });

  const templates: (Template & { previewUrl?: string })[] = [];
  for (const t of (tplData ?? [])) {
    const { data: signed } = await service.storage
      .from("templates")
      .createSignedUrl(t.storage_path, 600);
    templates.push({ ...t, previewUrl: signed?.signedUrl });
  }

  const { data: stripData } = await service
    .from("strips")
    .select("id,storage_path,created_at")
    .eq("photobook", true)
    .order("created_at", { ascending: false });

  const photobookStrips: PhotobookStrip[] = (stripData ?? []).map((s) => {
    const { data: pub } = service.storage.from("strips").getPublicUrl(s.storage_path);
    return { ...s, url: pub.publicUrl };
  });

  return <AdminPanel email={user.email!} templates={templates} photobookStrips={photobookStrips} />;
}

function SetupBanner() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl bg-white border border-[var(--color-ink)]/10 rounded-sm p-8 space-y-4 shadow">
        <h1 className="font-display text-2xl tracking-[0.25em] uppercase font-bold">Setup Required</h1>
        <p>Add Supabase credentials to <code>.env.local</code> and restart the dev server.</p>
        <pre className="bg-gray-50 p-4 rounded text-xs whitespace-pre-wrap leading-relaxed border">
{`NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_EMAILS=skylarmcr24@gmail.com

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...`}
        </pre>
        <p className="text-sm text-[var(--color-ink-soft)]">See <code>SETUP.md</code> in the repo for step-by-step instructions.</p>
      </div>
    </main>
  );
}