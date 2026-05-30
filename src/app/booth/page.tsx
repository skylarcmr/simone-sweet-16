"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, type CameraHandle } from "@/components/Camera";

const SHOT_COUNT = 4;
const COUNTDOWN_FROM = 3;
const PAUSE_BETWEEN = 1500;

type Phase = "idle" | "countdown" | "flash" | "between" | "done";

export default function BoothPage() {
  const router = useRouter();
  const cameraRef = useRef<CameraHandle>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [shotIndex, setShotIndex] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const photosRef = useRef<string[]>([]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      setShowFlash(true);
      setPhase("flash");
      const data = cameraRef.current?.capture();
      if (data) photosRef.current.push(data);
      setTimeout(() => setShowFlash(false), 600);
      setTimeout(() => {
        const next = shotIndex + 1;
        if (next >= SHOT_COUNT) {
          setPhase("done");
          // Persist photos to sessionStorage and navigate to /strip
          try {
            sessionStorage.setItem("strip:photos", JSON.stringify(photosRef.current));
          } catch {
            // sessionStorage may be too small for 4 large jpeg dataURLs in some browsers; truncate
            const compressed = photosRef.current;
            sessionStorage.setItem("strip:photos", JSON.stringify(compressed));
          }
          router.push("/strip");
        } else {
          setShotIndex(next);
          setCount(COUNTDOWN_FROM);
          setPhase("between");
          setTimeout(() => setPhase("countdown"), PAUSE_BETWEEN - 600);
        }
      }, 700);
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count, shotIndex, router]);

  function start() {
    photosRef.current = [];
    setShotIndex(0);
    setCount(COUNTDOWN_FROM);
    setPhase("countdown");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button onClick={() => router.push("/")} className="font-sans text-xs uppercase tracking-[0.3em] hover:text-[var(--color-pink-deep)]">
          ← exit
        </button>
        <div className="font-display tracking-[0.3em] text-sm">
          <span className="text-gold-foil font-bold">SHOT</span>{" "}
          <span className="font-bold">{Math.min(shotIndex + (phase === "idle" ? 0 : 1), SHOT_COUNT)}</span>
          {" / "}
          <span>{SHOT_COUNT}</span>
        </div>
      </header>

      <div className="flex-1 px-4 pb-10 flex flex-col items-center">
        {/* Booth viewfinder — Paris Sweet 16 frame */}
        <div className="relative w-full max-w-2xl">
          {/* decorative top: ribbon banner */}
          <div className="text-center mb-4">
            <p className="font-script text-3xl text-[var(--color-pink-deep)]" style={{ fontFamily: "Allura, cursive" }}>
              say <em>oui!</em>
            </p>
          </div>

          {/* Frame */}
          <div className="relative aspect-[4/3] bg-black rounded-sm shadow-2xl overflow-hidden border-[10px] border-[var(--color-ink)]">
            {/* gold inner border */}
            <div className="absolute inset-0 ring-2 ring-[var(--color-gold)] ring-inset pointer-events-none z-20" />

            <div className="absolute inset-0 z-0">
              <Camera ref={cameraRef} />
            </div>

            {/* Countdown overlay */}
            {phase === "countdown" && count > 0 && (
              <div key={`${shotIndex}-${count}`} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="count font-display font-black text-[12rem] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                  {count}
                </div>
              </div>
            )}
            {phase === "countdown" && count === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="count font-script text-7xl text-[var(--color-pink)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]" style={{ fontFamily: "Allura, cursive" }}>
                  smile!
                </div>
              </div>
            )}

            {showFlash && <div className="flash absolute inset-0 bg-white pointer-events-none z-30" />}

            {phase === "idle" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 z-10">
                <button
                  onClick={start}
                  className="bg-[var(--color-pink)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] font-display font-semibold tracking-[0.4em] text-lg px-12 py-5 rounded-full shadow-2xl transition uppercase border-2 border-[var(--color-gold)]"
                >
                  Start
                </button>
              </div>
            )}
          </div>

          {/* Decorative footer */}
          <div className="text-center mt-4 font-sans text-xs uppercase tracking-[0.3em] opacity-70">
            Simone&rsquo;s Sweet 16 · A Night in Paris
          </div>
        </div>
      </div>
    </main>
  );
}
