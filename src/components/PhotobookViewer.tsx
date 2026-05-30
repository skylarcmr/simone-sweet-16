"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";

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

type Strip = { id: string; url: string; created_at: string };

export default function PhotobookViewer() {
  const [open, setOpen] = useState(false);
  const [strips, setStrips] = useState<Strip[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flip, setFlip] = useState<"left" | "right" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photobook-strips", { cache: "no-store" });
      const j = await res.json();
      setStrips(Array.isArray(j.strips) ? j.strips : []);
    } catch {
      setStrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      load();
      setPage(0);
    }
  }, [open, load]);

  // Esc to close, arrows to navigate
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, page, strips.length]);

  const goPrev = () => {
    if (strips.length === 0 || page === 0) return;
    setFlip("left");
    setTimeout(() => {
      setPage((p) => Math.max(0, p - 1));
      setFlip(null);
    }, 280);
  };
  const goNext = () => {
    if (strips.length === 0 || page >= strips.length - 1) return;
    setFlip("right");
    setTimeout(() => {
      setPage((p) => Math.min(strips.length - 1, p + 1));
      setFlip(null);
    }, 280);
  };

  return (
    <>
      {/* Floating "book" trigger bottom-right */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open photobook"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 60,
          width: "76px",
          height: "96px",
          padding: 0,
          border: "none",
          cursor: "pointer",
          background: "transparent",
          filter: "drop-shadow(0 8px 20px rgba(10,10,10,0.18))",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <BookSpineIcon />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "560px",
              width: "100%",
              background: brand.cream,
              borderRadius: "4px",
              padding: "32px 28px 28px",
              boxShadow: "0 24px 64px rgba(10,10,10,0.4)",
              border: `1px solid ${brand.gold}40`,
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: brand.ink,
                opacity: 0.5,
              }}
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontFamily: font.script, fontSize: "32px", color: brand.gold, lineHeight: 1.1 }}>
                Simone&apos;s
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase" as const,
                  color: brand.ink,
                  marginTop: "2px",
                }}
              >
                Photobook
              </div>
            </div>

            {/* Book spread */}
            <div
              style={{
                position: "relative",
                background: brand.white,
                border: `1px solid ${brand.pinkBaby}66`,
                borderRadius: "2px",
                padding: "24px",
                minHeight: "440px",
                boxShadow: "inset 0 0 0 6px rgba(212,175,107,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                perspective: "1200px",
              }}
            >
              {loading ? (
                <div style={{ fontFamily: font.script, fontSize: "22px", color: brand.pinkBaby }}>loading…</div>
              ) : strips.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: font.script, fontSize: "26px", color: brand.pinkBaby, marginBottom: "8px" }}>
                    no memories yet
                  </div>
                  <p
                    style={{
                      fontFamily: font.body,
                      fontWeight: 300,
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      color: "rgba(10,10,10,0.4)",
                    }}
                  >
                    Be the first to add one
                  </p>
                </div>
              ) : (
                <div
                  key={page}
                  style={{
                    transition: "transform 0.28s ease, opacity 0.28s ease",
                    transformOrigin: flip === "right" ? "left center" : "right center",
                    transform:
                      flip === "right"
                        ? "rotateY(-30deg) translateX(8px)"
                        : flip === "left"
                        ? "rotateY(30deg) translateX(-8px)"
                        : "rotateY(0) translateX(0)",
                    opacity: flip ? 0.4 : 1,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={strips[page]?.url}
                    alt={`Strip ${strips[page]?.id}`}
                    style={{
                      maxHeight: "400px",
                      maxWidth: "100%",
                      display: "block",
                      boxShadow: "0 8px 24px rgba(10,10,10,0.12)",
                    }}
                  />
                </div>
              )}

              {/* Prev / Next arrows */}
              {strips.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={page === 0}
                    aria-label="Previous"
                    style={{
                      position: "absolute",
                      left: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: brand.white,
                      border: `1px solid ${brand.gold}55`,
                      cursor: page === 0 ? "not-allowed" : "pointer",
                      opacity: page === 0 ? 0.3 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: brand.ink,
                      boxShadow: "0 2px 8px rgba(10,10,10,0.08)",
                    }}
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={goNext}
                    disabled={page >= strips.length - 1}
                    aria-label="Next"
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: brand.white,
                      border: `1px solid ${brand.gold}55`,
                      cursor: page >= strips.length - 1 ? "not-allowed" : "pointer",
                      opacity: page >= strips.length - 1 ? 0.3 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: brand.ink,
                      boxShadow: "0 2px 8px rgba(10,10,10,0.08)",
                    }}
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Page indicator */}
            {strips.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "16px",
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: "10px",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase" as const,
                  color: "rgba(10,10,10,0.45)",
                }}
              >
                Page {page + 1} of {strips.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function BookSpineIcon() {
  return (
    <svg viewBox="0 0 76 96" width="76" height="96" xmlns="http://www.w3.org/2000/svg">
      {/* book back cover */}
      <rect x="6" y="6" width="64" height="84" rx="2" fill="#0a0a0a" />
      {/* gold spine band */}
      <rect x="6" y="22" width="64" height="3" fill="#d4af6b" />
      <rect x="6" y="69" width="64" height="3" fill="#d4af6b" />
      {/* front face / gold accent */}
      <rect x="10" y="10" width="56" height="76" rx="1.5" fill="#fdfaf3" />
      {/* monogram S */}
      <text
        x="38"
        y="58"
        textAnchor="middle"
        fontFamily="'Allura', cursive"
        fontSize="48"
        fill="#d4af6b"
      >
        S
      </text>
      {/* tiny decorative dots */}
      <circle cx="38" cy="22" r="1.2" fill="#f8c8d6" />
      <circle cx="38" cy="76" r="1.2" fill="#f8c8d6" />
    </svg>
  );
}
