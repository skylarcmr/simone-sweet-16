"use client";
import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const sb = getBrowserSupabase();
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to send link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-[var(--color-ink)]/10 rounded-sm shadow-md p-8">
        <h1 className="font-display text-2xl tracking-[0.25em] uppercase font-bold mb-2">
          <span className="text-gold-foil">Admin</span>
        </h1>
        <p className="font-script text-2xl text-[var(--color-pink-deep)] mb-6" style={{ fontFamily: "Allura, cursive" }}>
          welcome back
        </p>
        {sent ? (
          <div className="space-y-3">
            <p className="text-sm">A magic link was sent to <strong>{email}</strong>. Open it on this device.</p>
            <button onClick={() => setSent(false)} className="text-xs uppercase tracking-[0.3em] text-[var(--color-ink-soft)] hover:text-[var(--color-pink-deep)]">
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.3em]">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border-2 border-[var(--color-ink)]/40 px-4 py-3 rounded-sm font-sans focus:outline-none focus:border-[var(--color-pink-deep)]"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={busy || !email}
              className="w-full bg-[var(--color-ink)] text-white font-display font-semibold tracking-[0.3em] px-6 py-3.5 rounded-sm hover:bg-[var(--color-pink-deep)] transition disabled:opacity-50 uppercase"
            >
              {busy ? "Sending…" : "Send Magic Link"}
            </button>
            {err && <p className="text-sm text-red-700">{err}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
