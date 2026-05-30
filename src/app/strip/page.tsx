"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { renderStrip, renderPrintSheet } from "@/lib/stripRenderer";

type UploadState = "pending" | "uploading" | "ready" | "error";

export default function StripPage() {
  const router = useRouter();
  const stripCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("pending");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem("strip:photos") : null;
    if (!raw) { router.replace("/booth"); return; }
    let photos: string[] = [];
    try { photos = JSON.parse(raw); } catch { router.replace("/booth"); return; }
    if (!Array.isArray(photos) || photos.length < 4) { router.replace("/booth"); return; }

    (async () => {
      let templateUrl: string | undefined;
      try {
        const r = await fetch("/api/active-template");
        if (r.ok) { const j = await r.json(); if (j?.url) templateUrl = j.url; }
      } catch {}

      const strip = await renderStrip({ photos, templateUrl });
      stripCanvasRef.current = strip;
      const stripDataUrl = strip.toDataURL("image/png");
      setStripUrl(stripDataUrl);

      const sheet = await renderPrintSheet({ photos, templateUrl });
      setSheetUrl(sheet.toDataURL("image/png"));

      // Auto-upload so the QR is ready by the time the user looks up
      try {
        setUploadState("uploading");
        const blob: Blob = await new Promise(res => strip.toBlob(b => res(b!), "image/png"));
        const form = new FormData();
        form.append("file", blob, "strip.png");
        const r = await fetch("/api/upload-strip", { method: "POST", body: form });
        if (!r.ok) throw new Error(`upload failed (${r.status})`);
        const { id } = await r.json();
        setShareUrl(`${window.location.origin}/d/${id}`);
        setUploadState("ready");
      } catch (e: unknown) {
        setUploadState("error");
        setErrMsg(e instanceof Error ? e.message : "Upload failed");
      }
    })();
  }, [router]);

  function downloadPng(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
  }

  async function copyLink() {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="no-print px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button onClick={() => router.push("/")} className="font-sans text-xs uppercase tracking-[0.3em] hover:text-[var(--color-pink-deep)]">
          ← back to lobby
        </button>
        <div className="font-display tracking-[0.3em] text-sm font-bold">
          <span className="text-gold-foil">SIMONE</span> · SWEET 16
        </div>
      </header>

      <div className="no-print flex-1 max-w-6xl mx-auto px-6 py-6 grid lg:grid-cols-[auto_1fr] gap-12 items-start w-full">
        <div className="flex flex-col items-center">
          <p className="font-script text-3xl text-[var(--color-pink-deep)] mb-2" style={{ fontFamily: "Allura, cursive" }}>
            voilà! developing…
          </p>
          <h2 className="font-display font-bold text-2xl tracking-[0.25em] mb-6 uppercase text-center">
            Your strip is ready
          </h2>
          {stripUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={stripUrl}
              alt="Your photo strip"
              className="develop max-h-[78vh] w-auto shadow-2xl rotate-[-1deg] rounded-sm"
            />
          ) : (
            <div className="w-[280px] h-[840px] bg-gray-100 animate-pulse rounded-sm" />
          )}
        </div>

        <div className="space-y-7 max-w-md w-full mx-auto lg:mx-0">
          {/* QR — primary "take it home digitally" CTA */}
          <section className="bg-white border border-[var(--color-ink)]/10 rounded-sm p-6 shadow-sm text-center">
            <h3 className="font-display text-xl tracking-[0.25em] uppercase font-semibold mb-1">
              Scan to <span className="text-gold-foil">take it home</span>
            </h3>
            <p className="text-sm text-[var(--color-ink-soft)] mb-4">
              Point your phone camera at the code below.
            </p>

            <div className="mx-auto w-fit p-4 bg-white border-2 border-[var(--color-gold)] rounded-sm shadow-inner">
              {uploadState === "ready" && shareUrl ? (
                <QRCodeSVG
                  value={shareUrl}
                  size={224}
                  bgColor="#ffffff"
                  fgColor="#0a0a0a"
                  level="M"
                  includeMargin={false}
                />
              ) : uploadState === "error" ? (
                <div className="w-[224px] h-[224px] flex items-center justify-center text-sm text-red-700 px-4 text-center">
                  {errMsg ?? "Upload failed."}
                </div>
              ) : (
                <div className="w-[224px] h-[224px] bg-gray-50 animate-pulse flex items-center justify-center text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
                  preparing…
                </div>
              )}
            </div>

            {uploadState === "ready" && shareUrl && (
              <button
                onClick={copyLink}
                className="mt-4 text-xs uppercase tracking-[0.3em] underline text-[var(--color-ink-soft)] hover:text-[var(--color-pink-deep)]"
              >
                Or copy link
              </button>
            )}
          </section>

          {/* Print + download fallbacks */}
          <section className="space-y-3">
            <h3 className="font-display text-xl tracking-widest uppercase font-semibold">Or…</h3>
            <button
              disabled={!sheetUrl}
              onClick={() => window.print()}
              className="w-full bg-[var(--color-ink)] text-white font-display font-semibold tracking-[0.3em] px-6 py-3.5 rounded-sm hover:bg-[var(--color-pink-deep)] transition disabled:opacity-50 uppercase"
            >
              Print 4×6 sheet (2 strips)
            </button>
            <button
              disabled={!stripUrl}
              onClick={() => stripUrl && downloadPng(stripUrl, `simone-strip-${Date.now()}.png`)}
              className="w-full bg-white border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-display font-semibold tracking-[0.3em] px-6 py-3 rounded-sm hover:bg-[var(--color-ink)] hover:text-white transition uppercase"
            >
              Download on this device
            </button>
          </section>

          <div className="border-t pt-6">
            <button
              onClick={() => router.push("/booth")}
              className="text-sm uppercase tracking-[0.3em] text-[var(--color-ink-soft)] hover:text-[var(--color-pink-deep)]"
            >
              ↺ Take another set
            </button>
          </div>
        </div>
      </div>

      {/* Hidden print sheet — only rendered during print */}
      <div className="hidden print:block">
        {sheetUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sheetUrl} alt="" className="print-sheet" style={{ width: "4in", height: "6in" }} />
        )}
      </div>
    </main>
  );
}
