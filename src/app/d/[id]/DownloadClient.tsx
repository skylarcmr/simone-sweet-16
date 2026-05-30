"use client";
import { Download } from "lucide-react";
import { SparkleIcon } from "@/components/illustrations";

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

export default function DownloadClient({ imageUrl, stripId }: { imageUrl: string; stripId: string }) {
  async function download() {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `simone-sweet-16-${stripId}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open(imageUrl, "_blank");
    }
  }

  return (
    <div
      style={{
        fontFamily: font.body,
        backgroundColor: brand.cream,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px 40px",
        color: brand.ink,
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <SparkleIcon size={11} color={brand.pinkBaby} />
          <SparkleIcon size={14} color={brand.gold} />
          <SparkleIcon size={11} color={brand.pinkBaby} />
        </div>

        <div
          style={{
            fontFamily: font.script,
            fontSize: "52px",
            color: brand.gold,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          voilà!
        </div>

        <h1
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: "22px",
            color: brand.ink,
            textAlign: "center",
            margin: "4px 0 32px",
          }}
        >
          Your Strip
        </h1>

        <div
          style={{
            marginBottom: "36px",
            background: brand.white,
            border: `3px solid ${brand.pinkBaby}`,
            borderRadius: "2px",
            padding: "8px",
            boxShadow: "0 8px 40px rgba(10,10,10,0.14)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Your photo strip"
            style={{ width: "100%", maxWidth: "200px", display: "block" }}
          />
        </div>

        <button
          onClick={download}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "20px",
            background: brand.ink,
            color: brand.white,
            border: "none",
            borderRadius: "1px",
            fontFamily: font.body,
            fontWeight: 400,
            fontSize: "12px",
            letterSpacing: "0.32em",
            textTransform: "uppercase" as const,
            cursor: "pointer",
            marginBottom: "14px",
          }}
        >
          <Download size={16} strokeWidth={1.5} />
          Save to My Phone
        </button>

        <p
          style={{
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.05em",
            color: "rgba(10,10,10,0.42)",
            textAlign: "center",
            lineHeight: 1.7,
            margin: "0 0 40px",
          }}
        >
          On iPhone, tap Save then check your Photos app.
          <br />
          On Android, check your Downloads folder.
        </p>

        <div style={{ width: "60px", height: "1px", background: brand.pinkBaby, marginBottom: "28px" }} />

        <p
          style={{
            fontFamily: font.script,
            fontSize: "24px",
            color: brand.pinkBaby,
            textAlign: "center",
            margin: 0,
          }}
        >
          merci, ma chérie ✨
        </p>

        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <SparkleIcon size={9} color={brand.gold} />
          <SparkleIcon size={7} color={brand.pinkBaby} />
          <SparkleIcon size={9} color={brand.gold} />
        </div>

        <p
          style={{
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "rgba(10,10,10,0.3)",
            textAlign: "center",
            marginTop: "48px",
          }}
        >
          Simone&rsquo;s Sweet 16 · A Night in Paris · August 8
        </p>
      </div>
    </div>
  );
}
