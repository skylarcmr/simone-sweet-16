"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SparkleIcon, ScatteredSparkles } from "@/components/illustrations";

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

type T = { id: string; name: string; previewUrl: string | null };

export default function PickClient({ templates }: { templates: T[] }) {
  const router = useRouter();

  const choose = (t: T) => {
    try {
      sessionStorage.setItem("s16_template_id", t.id);
      sessionStorage.setItem("s16_template_name", t.name);
    } catch {}
    router.push("/booth");
  };

  return (
    <div style={{ fontFamily: font.body, backgroundColor: brand.cream, minHeight: "100vh", color: brand.ink }}>
      {/* Header */}
      <header
        style={{
          padding: "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(10,10,10,0.07)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/eiffel-mini.png" alt="mini Eiffel" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.08em",
              color: brand.ink,
            }}
          >
            Simone <span style={{ color: brand.gold }}>·</span> Sweet 16
          </span>
        </Link>
      </header>

      {/* Hero copy */}
      <section
        style={{
          padding: "70px 48px 36px",
          textAlign: "center",
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            color: brand.gold,
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase" as const,
            marginBottom: "18px",
          }}
        >
          <SparkleIcon size={12} />
          <span>choose your style</span>
          <SparkleIcon size={12} />
        </div>

        <h1
          style={{
            fontFamily: font.script,
            fontSize: "92px",
            color: brand.gold,
            lineHeight: 1,
            margin: "0 0 14px",
            fontWeight: 400,
          }}
        >
          pick a frame, ma chérie
        </h1>

        <p
          style={{
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "13px",
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: "rgba(10,10,10,0.55)",
            margin: 0,
          }}
        >
          tap one to start your strip
        </p>
      </section>

      {/* Templates grid */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 48px 80px" }}>
        {templates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "rgba(10,10,10,0.5)",
              fontFamily: font.script,
              fontSize: "32px",
            }}
          >
            no frames yet — admin needs to upload some
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(templates.length, 3)}, minmax(0, 1fr))`,
              gap: "32px",
              alignItems: "start",
              justifyItems: "center",
            }}
          >
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => choose(t)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  width: "100%",
                  maxWidth: "260px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 3",
                    background: brand.white,
                    border: `2px solid ${brand.gold}`,
                    boxShadow: "0 18px 40px rgba(212,175,107,0.18)",
                    overflow: "hidden",
                    borderRadius: "4px",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 28px 56px rgba(212,175,107,0.32)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 18px 40px rgba(212,175,107,0.18)";
                  }}
                >
                  {t.previewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={t.previewUrl}
                      alt={t.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(10,10,10,0.3)",
                        fontFamily: font.script,
                        fontSize: "20px",
                      }}
                    >
                      preview unavailable
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: font.script,
                    fontSize: "32px",
                    color: brand.ink,
                    lineHeight: 1,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: font.body,
                    fontWeight: 400,
                    fontSize: "10px",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase" as const,
                    color: brand.gold,
                  }}
                >
                  tap to choose
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Decorative scatter */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.4, zIndex: 0 }}>
        <ScatteredSparkles />
      </div>
    </div>
  );
}
