"use client";
import Link from "next/link";
import { Camera, Printer } from "lucide-react";
import { SparkleIcon, BalloonBouquet, ScatteredSparkles } from "@/components/illustrations";
import PhotobookViewer from "@/components/PhotobookViewer";

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

export default function LandingPage() {
  return (
    <div style={{ fontFamily: font.body, backgroundColor: brand.cream, minHeight: "100vh", color: brand.ink }}>
      <PhotobookViewer />
      {/* ─── Header ─── */}
      <header
        style={{
          padding: "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(10,10,10,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
        </div>
        <Link
          href="/admin/login"
          style={{
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            color: brand.ink,
            opacity: 0.45,
            textDecoration: "none",
          }}
        >
          Admin
        </Link>
      </header>

      {/* ─── Hero ─── */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "82vh",
          padding: "60px 80px",
          gap: "48px",
          maxWidth: "1440px",
          margin: "0 auto",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 480px", maxWidth: "480px" }}>
          <div
            style={{
              fontFamily: font.script,
              fontSize: "30px",
              color: brand.pinkBaby,
              marginBottom: "4px",
              lineHeight: 1.2,
            }}
          >
            she is turning
          </div>

          <h1
            style={{
              fontFamily: font.display,
              fontWeight: 900,
              fontSize: "clamp(64px, 8vw, 108px)",
              lineHeight: 0.95,
              margin: "0 0 4px",
              color: brand.ink,
            }}
          >
            Sweet
          </h1>
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(80px, 10vw, 136px)",
              lineHeight: 0.9,
              color: brand.gold,
              marginBottom: "28px",
            }}
          >
            16
          </div>

          <p
            style={{
              fontFamily: font.body,
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase" as const,
              color: brand.ink,
              opacity: 0.6,
              margin: "0 0 42px",
            }}
          >
            A Night in Paris · August 8, 2026
          </p>

          <Link
            href="/pick"
            style={{
              display: "inline-block",
              padding: "18px 52px",
              background: brand.ink,
              color: brand.white,
              fontFamily: font.body,
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.32em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              borderRadius: "1px",
              transition: "opacity 0.2s",
            }}
          >
            Enter the Booth
          </Link>

          <div style={{ marginTop: "36px", display: "flex", alignItems: "center", gap: "8px" }}>
            <SparkleIcon size={13} />
            <SparkleIcon size={9} color={brand.pinkBaby} />
            <SparkleIcon size={13} />
            <ScatteredSparkles />
          </div>
        </div>

        <div
          style={{
            flex: "1 1 360px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingBottom: "20px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/eiffel-hero.png"
            alt="Eiffel Tower with pink bow"
            style={{
              maxWidth: "100%",
              maxHeight: "560px",
              objectFit: "contain",
              filter: "drop-shadow(0 8px 32px rgba(10,10,10,0.06))",
            }}
          />
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section
        style={{
          padding: "70px 80px",
          background: brand.pinkSoft,
          borderTop: "1px solid rgba(248,200,214,0.4)",
          borderBottom: "1px solid rgba(248,200,214,0.4)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase" as const,
              textAlign: "center",
              color: brand.ink,
              marginBottom: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <SparkleIcon size={11} /> How It Works <SparkleIcon size={11} />
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            {[
              { icon: <Camera size={30} strokeWidth={1.2} />, num: "01", title: "Pose", body: "Step up to the camera and find your best angle — the booth is all yours." },
              { icon: <span style={{ fontSize: "22px", fontFamily: font.display, fontWeight: 900 }}>×4</span>, num: "02", title: "Smile", body: "Four shots with a 3-second countdown each. Cheese, ma chérie!" },
              { icon: <Printer size={30} strokeWidth={1.2} />, num: "03", title: "Print or Scan", body: "Grab your strip from the printer or scan the QR code to download." },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: brand.white,
                  border: "1px solid rgba(10,10,10,0.06)",
                  borderRadius: "2px",
                  padding: "44px 32px",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(10,10,10,0.04)",
                }}
              >
                <div style={{ color: brand.gold, marginBottom: "14px" }}>{card.icon}</div>
                <div style={{ fontFamily: font.script, fontSize: "22px", color: brand.pinkBaby, marginBottom: "6px", lineHeight: 1 }}>{card.num}</div>
                <h3 style={{ fontFamily: font.display, fontWeight: 700, fontSize: "17px", margin: "0 0 12px", color: brand.ink }}>{card.title}</h3>
                <p style={{ fontFamily: font.body, fontWeight: 300, fontSize: "12.5px", letterSpacing: "0.04em", color: "rgba(10,10,10,0.58)", margin: 0, lineHeight: 1.75 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", padding: "56px 0 40px", gap: "48px", flexWrap: "wrap" }}>
        <BalloonBouquet />
        <div style={{ textAlign: "center", paddingBottom: "12px" }}>
          <div style={{ fontFamily: font.script, fontSize: "36px", color: brand.gold, lineHeight: 1.2 }}>voilà!</div>
          <div style={{ fontFamily: font.body, fontWeight: 300, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(10,10,10,0.4)", marginTop: "6px" }}>
            your memories await
          </div>
        </div>
        <BalloonBouquet />
      </div>

      <footer
        style={{
          borderTop: "1px solid rgba(10,10,10,0.07)",
          padding: "28px 80px",
          textAlign: "center",
          background: brand.cream,
        }}
      >
        <p style={{ fontFamily: font.body, fontWeight: 300, fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(10,10,10,0.42)", margin: "0 0 8px" }}>
          August 8, 2026 · A Night in Paris · save the night
        </p>
        <p style={{ fontFamily: font.script, fontSize: "22px", color: brand.gold, margin: 0 }}>Simone</p>
      </footer>
    </div>
  );
}
