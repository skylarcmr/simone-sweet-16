"use client";
import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { MiniEiffelSVG, SparkleIcon } from "@/components/illustrations";

const brand = {
  cream: "#fdfaf3",
  pinkBaby: "#f8c8d6",
  pinkSoft: "#fce4ec",
  ink: "#0a0a0a",
  gold: "#d4af6b",
  white: "#ffffff",
};
const font = {
  display: "'Playfair Display', Georgia, serif",
  script: "'Allura', cursive",
  body: "'Montserrat', system-ui, sans-serif",
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
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
  };

  return (
    <div
      style={{
        fontFamily: font.body,
        backgroundColor: brand.cream,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        color: brand.ink,
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <MiniEiffelSVG size={52} />
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
        <SparkleIcon size={10} color={brand.pinkBaby} />
        <SparkleIcon size={12} color={brand.gold} />
        <SparkleIcon size={10} color={brand.pinkBaby} />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: brand.white,
          border: "1px solid rgba(10,10,10,0.08)",
          borderRadius: "2px",
          padding: "44px 40px",
          boxShadow: "0 8px 48px rgba(10,10,10,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.38em",
              textTransform: "uppercase" as const,
              color: brand.gold,
              marginBottom: "6px",
            }}
          >
            Admin
          </div>
          <div style={{ fontFamily: font.script, fontSize: "30px", color: brand.ink, lineHeight: 1.2 }}>
            welcome back
          </div>
          <div style={{ width: "48px", height: "1px", background: brand.pinkBaby, margin: "16px auto 0" }} />
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: "10px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase" as const,
                  color: "rgba(10,10,10,0.5)",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="skylar@example.com"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  border: `2px solid ${focused ? brand.pinkBaby : "rgba(10,10,10,0.14)"}`,
                  borderRadius: "1px",
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: "14px",
                  color: brand.ink,
                  background: "transparent",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box" as const,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                padding: "16px",
                background: brand.ink,
                color: brand.white,
                border: "none",
                borderRadius: "1px",
                fontFamily: font.body,
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase" as const,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.6 : 1,
                marginTop: "4px",
              }}
            >
              {busy ? "Sending…" : "Send Magic Link"}
            </button>
            {err && (
              <p style={{ fontFamily: font.body, fontSize: "11px", color: "#c0392b", margin: 0, textAlign: "center" }}>
                {err}
              </p>
            )}
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <SparkleIcon size={28} color={brand.gold} />
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: "13px",
                letterSpacing: "0.05em",
                color: "rgba(10,10,10,0.6)",
                lineHeight: 1.8,
                marginTop: "16px",
              }}
            >
              Magic link sent to <span style={{ color: brand.ink, fontWeight: 400 }}>{email}</span>
            </p>
            <p style={{ fontFamily: font.script, fontSize: "20px", color: brand.pinkBaby, marginTop: "8px" }}>
              check your inbox…
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{
                marginTop: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: font.body,
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
                color: "rgba(10,10,10,0.4)",
              }}
            >
              Use a different email
            </button>
          </div>
        )}
      </div>

      <p
        style={{
          fontFamily: font.body,
          fontWeight: 300,
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "rgba(10,10,10,0.3)",
          marginTop: "32px",
          textAlign: "center",
        }}
      >
        Simone&rsquo;s Sweet 16 · Staff Only
      </p>
    </div>
  );
}
