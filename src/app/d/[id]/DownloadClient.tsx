"use client";

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
      // Fallback: open in new tab so iOS Safari can long-press to save.
      window.open(imageUrl, "_blank");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-8 max-w-md mx-auto w-full">
      <p className="font-script text-4xl text-[var(--color-pink-deep)] rotate-[-2deg] mb-1" style={{ fontFamily: "Allura, cursive" }}>
        voilà!
      </p>
      <h1 className="font-display text-2xl tracking-[0.25em] uppercase font-bold mb-1 text-center">
        Your strip
      </h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-6 text-center">
        from Simone&rsquo;s Sweet 16 · A Night in Paris
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Your photo strip"
        className="develop max-h-[60vh] w-auto rounded-sm shadow-2xl mb-6"
      />

      <button
        onClick={download}
        className="w-full bg-[var(--color-ink)] text-white font-display font-semibold tracking-[0.3em] px-6 py-4 rounded-sm hover:bg-[var(--color-pink-deep)] transition uppercase shadow-lg"
      >
        Save to my phone
      </button>

      <p className="text-xs text-center text-[var(--color-ink-soft)] mt-4 leading-relaxed">
        On iPhone, after tapping save you may need to confirm in your Files app.<br />
        On Android, the strip lands in your Downloads folder.
      </p>

      <p className="font-script text-2xl text-[var(--color-gold)] mt-8" style={{ fontFamily: "Allura, cursive" }}>
        merci, ma chérie ✨
      </p>
    </main>
  );
}
