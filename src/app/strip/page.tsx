"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, Download, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SparkleIcon, FairyLightGarland, RibbonBannerSVG } from "@/components/illustrations";

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

const STRIP_W = 600;
const STRIP_H = 1800;
const PHOTO_W = 560;
const PHOTO_H = 420;
const PAD = 20;
const GAP = 14;
const photoYs = [PAD, PAD + PHOTO_H + GAP, PAD + (PHOTO_H + GAP) * 2, PAD + (PHOTO_H + GAP) * 3];
const BANNER_Y = PAD + (PHOTO_H + GAP) * 4 - GAP;

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderStrip(canvas: HTMLCanvasElement, photos: string[], template?: string | null): Promise<void> {
  canvas.width = STRIP_W;
  canvas.height = STRIP_H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = brand.white;
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);

  await Promise.all(
    photos.map(async (src, i) => {
      try {
        const img = await loadImage(src);
        const x = (STRIP_W - PHOTO_W) / 2;
        ctx.drawImage(img, x, photoYs[i], PHOTO_W, PHOTO_H);
      } catch {
        ctx.fillStyle = brand.pinkSoft;
        ctx.fillRect((STRIP_W - PHOTO_W) / 2, photoYs[i], PHOTO_W, PHOTO_H);
      }
    })
  );

  const bannerH = STRIP_H - BANNER_Y;
  ctx.fillStyle = brand.pinkSoft;
  ctx.fillRect(0, BANNER_Y, STRIP_W, bannerH);

  ctx.strokeStyle = brand.gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(20, BANNER_Y);
  ctx.lineTo(STRIP_W - 20, BANNER_Y);
  ctx.stroke();

  ctx.font = `italic 700 52px 'Playfair Display', serif`;
  ctx.fillStyle = brand.gold;
  ctx.textAlign = "center";
  ctx.fillText("Simone", STRIP_W / 2, BANNER_Y + 70);

  ctx.font = `300 18px 'Montserrat', sans-serif`;
  ctx.fillStyle = brand.ink;
  ctx.fillText("SWEET 16 · AUGUST 8, 2026", STRIP_W / 2, BANNER_Y + 108);

  ctx.font = `300 14px 'Montserrat', sans-serif`;
  ctx.fillStyle = "rgba(10,10,10,0.4)";
  ctx.fillText("A Night in Paris", STRIP_W / 2, BANNER_Y + 138);

  ctx.strokeStyle = brand.pinkBaby;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, STRIP_W - 6, STRIP_H - 6);

  if (template) {
    try {
      const tpl = await loadImage(template);
      ctx.drawImage(tpl, 0, 0, STRIP_W, STRIP_H);
    } catch {}
  }
}

async function fetchTemplate(id: string | null): Promise<string | null> {
  try {
    const url = id ? `/api/template?id=${encodeURIComponent(id)}` : "/api/template";
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return typeof json?.url === "string" ? json.url : null;
  } catch {
    return null;
  }
}

export default function StripPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [developing, setDeveloping] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[] | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  // Read photos from sessionStorage on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("s16_photos");
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length === 4) {
        setPhotos(parsed);
      } else {
        setPhotos([]);
      }
    } catch {
      setPhotos([]);
    }
  }, []);

  // Render strip + upload to Supabase.
  useEffect(() => {
    if (!photos || photos.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const timer = setTimeout(async () => {
      let chosenId: string | null = null;
      try {
        chosenId = sessionStorage.getItem("s16_template_id");
      } catch {}
      const tpl = await fetchTemplate(chosenId);
      await renderStrip(canvas, photos, tpl);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setDownloadUrl(dataUrl);
      setReady(true);
      setDeveloping(false);

      // Upload PNG and get short ID for QR
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png", 0.92)
        );
        if (!blob) throw new Error("No blob");
        const fd = new FormData();
        fd.append("file", blob, "strip.png");
        const res = await fetch("/api/upload-strip", { method: "POST", body: fd });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const json = await res.json();
        if (json?.id) {
          setShortUrl(`${window.location.origin}/d/${json.id}`);
        }
      } catch (e: unknown) {
        setUploadErr(e instanceof Error ? e.message : "Upload failed");
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, [photos]);

  const handlePrint = async () => {
    if (!canvasRef.current) return;
    const printCanvas = document.createElement("canvas");
    printCanvas.width = STRIP_W * 2;
    printCanvas.height = STRIP_H;
    const ctx = printCanvas.getContext("2d")!;
    ctx.fillStyle = brand.white;
    ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);
    ctx.drawImage(canvasRef.current, 0, 0);
    ctx.drawImage(canvasRef.current, STRIP_W, 0);
    ctx.setLineDash([12, 8]);
    ctx.strokeStyle = "rgba(10,10,10,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(STRIP_W, 0);
    ctx.lineTo(STRIP_W, STRIP_H);
    ctx.stroke();

    const url = printCanvas.toDataURL("image/jpeg", 0.95);
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${url}" style="width:100%"/>`);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 600);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "simone-sweet16-strip.jpg";
    a.click();
  };

  if (photos !== null && photos.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: brand.cream,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <div style={{ fontFamily: font.script, fontSize: "36px", color: brand.gold }}>oops!</div>
        <p style={{ fontFamily: font.body, fontWeight: 300, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(10,10,10,0.5)" }}>
          No photos found
        </p>
        <button
          onClick={() => router.push("/booth")}
          style={{
            padding: "14px 40px",
            background: brand.ink,
            color: brand.white,
            border: "none",
            cursor: "pointer",
            fontFamily: font.body,
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          Take Photos
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: font.body, backgroundColor: brand.cream, minHeight: "100vh", color: brand.ink }}>
      <header style={{ padding: "18px 40px", borderBottom: "1px solid rgba(10,10,10,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", color: brand.ink }}>
          Simone <span style={{ color: brand.gold }}>·</span> Sweet 16
        </div>
        <button
          onClick={() => router.push("/booth")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "rgba(10,10,10,0.45)",
          }}
        >
          <RotateCcw size={12} strokeWidth={1.5} /> Take another set
        </button>
      </header>

      <div style={{ paddingLeft: "8%", paddingRight: "8%" }}>
        <FairyLightGarland width={1100} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "60px",
          padding: "48px 80px 60px",
          maxWidth: "1300px",
          margin: "0 auto",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left: strip preview */}
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              transform: "rotate(-2.5deg)",
              boxShadow: "0 12px 60px rgba(10,10,10,0.18), 0 4px 16px rgba(10,10,10,0.1)",
              transition: "opacity 1.2s ease",
              opacity: ready ? 1 : 0.35,
              position: "relative",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <canvas ref={canvasRef} style={{ display: "block", width: "175px", height: "525px", imageRendering: "auto" }} />
          </div>
          <div
            style={{
              fontFamily: font.script,
              fontSize: "18px",
              color: brand.gold,
              opacity: developing ? 1 : 0,
              transition: "opacity 0.6s",
            }}
          >
            developing…
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* QR card */}
          <div
            style={{
              background: brand.white,
              border: `2px solid ${brand.gold}`,
              borderRadius: "2px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(10,10,10,0.05)",
            }}
          >
            <div
              style={{
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase" as const,
                color: brand.ink,
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <SparkleIcon size={10} /> Scan to Take It Home <SparkleIcon size={10} />
            </div>
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "rgba(10,10,10,0.45)",
                margin: "0 0 28px",
              }}
            >
              Point your phone camera at the code below
            </p>

            <div
              style={{
                padding: "16px",
                background: brand.white,
                border: "1px solid rgba(10,10,10,0.1)",
                borderRadius: "2px",
                minHeight: "200px",
                minWidth: "200px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              } as React.CSSProperties}
            >
              {shortUrl ? (
                <QRCodeSVG value={shortUrl} size={168} fgColor={brand.ink} bgColor={brand.white} level="M" />
              ) : (
                <div style={{ fontFamily: font.script, fontSize: "20px", color: brand.pinkBaby, padding: "60px 20px" }}>
                  {uploadErr ? "upload failed" : "preparing…"}
                </div>
              )}
            </div>

            <p style={{ fontFamily: font.script, fontSize: "18px", color: brand.pinkBaby, margin: "20px 0 0" }}>
              your memories, always
            </p>
            {uploadErr && (
              <p style={{ fontFamily: font.body, fontSize: "10px", color: "#c0392b", marginTop: "8px" }}>
                {uploadErr}
              </p>
            )}
          </div>

          {/* Print / download */}
          <div
            style={{
              background: brand.white,
              border: "1px solid rgba(10,10,10,0.07)",
              borderRadius: "2px",
              padding: "32px 40px",
              boxShadow: "0 4px 20px rgba(10,10,10,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase" as const,
                color: "rgba(10,10,10,0.4)",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Or…
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button
                onClick={handlePrint}
                disabled={!ready}
                style={{
                  flex: "1 1 140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px 20px",
                  background: brand.ink,
                  color: brand.white,
                  border: "none",
                  borderRadius: "1px",
                  fontFamily: font.body,
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase" as const,
                  cursor: ready ? "pointer" : "not-allowed",
                  opacity: ready ? 1 : 0.4,
                  transition: "opacity 0.2s",
                }}
              >
                <Printer size={15} strokeWidth={1.5} />
                Print 4×6
              </button>

              <button
                onClick={handleDownload}
                disabled={!ready}
                style={{
                  flex: "1 1 140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px 20px",
                  background: brand.white,
                  color: brand.ink,
                  border: `2px solid ${brand.ink}`,
                  borderRadius: "1px",
                  fontFamily: font.body,
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase" as const,
                  cursor: ready ? "pointer" : "not-allowed",
                  opacity: ready ? 1 : 0.4,
                  transition: "opacity 0.2s",
                }}
              >
                <Download size={15} strokeWidth={1.5} />
                Download
              </button>
            </div>
          </div>

          {/* Banner preview */}
          <div style={{ textAlign: "center", paddingTop: "8px" }}>
            <RibbonBannerSVG width={340} />
            <div style={{ fontFamily: font.script, fontSize: "28px", color: brand.gold, marginTop: "-40px", lineHeight: 1, position: "relative" }}>
              Simone
            </div>
            <div style={{ fontFamily: font.body, fontWeight: 300, fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(10,10,10,0.4)", marginTop: "10px" }}>
              Sweet 16 · August 8, 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
