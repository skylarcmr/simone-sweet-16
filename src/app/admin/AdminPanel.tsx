"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadTemplate, setActiveTemplate, deleteTemplate, signOut } from "./actions";

type T = { id: string; name: string; storage_path: string; active: boolean; created_at: string; previewUrl?: string };

export default function AdminPanel({ email, templates }: { email: string; templates: T[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !name.trim()) return;
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("file", file);
    setMsg(null);
    start(async () => {
      const res = await uploadTemplate(fd);
      if (res?.error) setMsg(`Error: ${res.error}`);
      else { setName(""); setFile(null); router.refresh(); }
    });
  }

  return (
    <main className="min-h-screen px-6 py-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl tracking-[0.25em] uppercase font-bold">
            <span className="text-gold-foil">Templates</span>
          </h1>
          <p className="font-script text-2xl text-[var(--color-pink-deep)]" style={{ fontFamily: "Allura, cursive" }}>
            bonjour, {email.split("@")[0]}
          </p>
        </div>
        <form action={signOut}>
          <button className="text-xs uppercase tracking-[0.3em] underline hover:text-[var(--color-pink-deep)]">Sign out</button>
        </form>
      </header>

      <section className="bg-white border border-[var(--color-ink)]/10 rounded-sm p-6 mb-10 shadow-sm">
        <h2 className="font-display text-xl tracking-widest uppercase font-semibold mb-1">Upload a Template</h2>
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">
          PNG with transparency, sized <strong>600×1800 px</strong> (2&quot;×6&quot; @ 300 DPI). Photos appear underneath; your art prints on top.
        </p>
        <form onSubmit={handleUpload} className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border-2 border-[var(--color-ink)]/40 px-3 py-2 rounded-sm focus:outline-none focus:border-[var(--color-pink-deep)]"
              placeholder="Paris Night v1"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] mb-1">PNG</label>
            <input
              type="file"
              accept="image/png"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              required
              className="border-2 border-[var(--color-ink)]/40 px-3 py-2 rounded-sm w-full sm:w-auto"
            />
          </div>
          <button
            disabled={pending || !file || !name}
            className="bg-[var(--color-ink)] text-white font-display tracking-[0.3em] px-6 py-2.5 rounded-sm hover:bg-[var(--color-pink-deep)] transition uppercase disabled:opacity-50"
          >
            {pending ? "Uploading…" : "Upload"}
          </button>
        </form>
        {msg && <p className="mt-3 text-sm text-red-700">{msg}</p>}
      </section>

      <section>
        <h2 className="font-display text-xl tracking-widest uppercase font-semibold mb-4">All Templates</h2>
        {templates.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">No templates yet. Upload your first one above.</p>
        ) : (
          <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {templates.map(t => (
              <div key={t.id} className={`border rounded-sm overflow-hidden bg-white shadow-sm flex flex-col ${t.active ? "border-[var(--color-pink-deep)] ring-2 ring-[var(--color-gold)]" : "border-[var(--color-ink)]/15"}`}>
                <div className="aspect-[1/3] bg-[#fafafa] checker">
                  {t.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.previewUrl} alt={t.name} className="w-full h-full object-contain" />
                  ) : null}
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-semibold truncate">{t.name}</p>
                    {t.active && <span className="text-[10px] uppercase tracking-widest bg-[var(--color-pink)] px-1.5 py-0.5 rounded-sm">Active</span>}
                  </div>
                  <div className="flex gap-2">
                    {!t.active && (
                      <form action={async () => { await setActiveTemplate(t.id); router.refresh(); }}>
                        <button className="text-xs uppercase tracking-[0.2em] underline hover:text-[var(--color-pink-deep)]">Set active</button>
                      </form>
                    )}
                    <form action={async () => { if (confirm(`Delete "${t.name}"?`)) { await deleteTemplate(t.id); router.refresh(); } }}>
                      <button className="text-xs uppercase tracking-[0.2em] text-red-700 hover:underline ml-auto">Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <style jsx>{`
        .checker {
          background-image:
            linear-gradient(45deg, #eee 25%, transparent 25%),
            linear-gradient(-45deg, #eee 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #eee 75%),
            linear-gradient(-45deg, transparent 75%, #eee 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0;
        }
      `}</style>
    </main>
  );
}
