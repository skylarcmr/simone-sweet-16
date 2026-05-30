"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FairyLightGarland, SparkleIcon } from "@/components/illustrations";

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

type Phase = "loading" | "idle" | "countdown" | "smile" | "flash" | "between" | "done";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function BoothPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const running = useRef(false);

  const [phase, setPhase] = useState<Phase>("loading");
  const [countdown, setCountdown] = useState(3);
  const [shotNum, setShotNum] = useState(1);
  const [photoCount, setPhotoCount] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [garlandWidth, setGarlandWidth] = useState(800);

  useEffect(() => {
    setGarlandWidth(Math.min(window.innerWidth * 0.8, 900));
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
        setPhase("idle");
      })
      .catch(() => {
        setCameraError(true);
        setPhase("idle");
      });
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const captureFrame = useCallback((): string => {
    const canvas = captureRef.current!;
    const video = videoRef.current!;
    const pw = 560, ph = 420;
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext("2d")!;

    if (!cameraError && video && video.readyState >= 2 && video.videoWidth > 0) {
      const vw = video.videoWidth, vh = video.videoHeight;
      const targetAspect = pw / ph;
      const videoAspect = vw / vh;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (videoAspect > targetAspect) {
        sw = vh * targetAspect;
        sx = (vw - sw) / 2;
      } else {
        sh = vw / targetAspect;
        sy = (vh - sh) / 2;
      }
      ctx.save();
      ctx.translate(pw, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, pw, ph);
      ctx.restore();
    } else {
      const gradient = ctx.createLinearGradient(0, 0, pw, ph);
      gradient.addColorStop(0, brand.pinkSoft);
      gradient.addColorStop(1, brand.pinkBaby);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, pw, ph);
      ctx.font = "bold 72px serif";
      ctx.fillStyle = brand.gold;
      ctx.textAlign = "center";
      ctx.fillText("✦", pw / 2, ph / 2 + 26);
    }

    return canvas.toDataURL("image/jpeg", 0.88);
  }, [cameraError]);

  const startSession = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    const collected: string[] = [];

    for (let shot = 1; shot <= 4; shot++) {
      setShotNum(shot);
      for (let n = 3; n >= 1; n--) {
        setCountdown(n);
        setPhase("countdown");
        await sleep(1000);
      }
      setPhase("smile");
      await sleep(700);

      setShowFlash(true);
      setPhase("flash");
      await sleep(220);

      const photo = captureFrame();
      collected.push(photo);
      setPhotoCount(collected.length);
      setShowFlash(false);

      if (shot < 4) {
        setPhase("between");
        await sleep(750);
      }
    }

    setPhase("done");
    running.current = false;
    // Hand off photos to /strip via sessionStorage (data URLs are large; sessionStorage is fine)
    try {
      sessionStorage.setItem("s16_photos", JSON.stringify(collected));
    } catch (e) {
      console.error("Failed to store photos:", e);
    }
    setTimeout(() => {
      router.push("/strip");
    }, 400);
  }, [captureFrame, router]);

  const countdownColor = phase === "smile" ? brand.pinkBaby : brand.white;
  const countdownText = phase === "smile" ? "SMILE!" : phase === "countdown" ? String(countdown) : "";

  return (
    <div
      style={{
        fontFamily: font.body,
        backgroundColor: brand.ink,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: brand.white,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showFlash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: brand.white,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(255,255,255,0.65)",
            textDecoration: "none",
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
          }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
          Exit
        </Link>

        <div
          style={{
            fontFamily: font.body,
            fontWeight: 400,
            fontSize: "11px",
            letterSpacing: "0.28em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {phase === "loading"
            ? "loading camera…"
            : phase === "done"
            ? "developing…"
            : `Shot ${Math.min(shotNum, 4)} / 4`}
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: n <= photoCount ? brand.gold : "rgba(255,255,255,0.2)",
                border: `1px solid ${n <= photoCount ? brand.gold : "rgba(255,255,255,0.3)"}`,
                transition: "background 0.3s, border 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ paddingLeft: "10%", paddingRight: "10%", marginTop: "-4px" }}>
        <FairyLightGarland width={garlandWidth} />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 32px 40px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "760px",
            aspectRatio: "4/3",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              border: `2px solid ${brand.gold}`,
              borderRadius: "1px",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
          {[
            { top: -8, left: -8 },
            { top: -8, right: -8 },
            { bottom: -8, left: -8 },
            { bottom: -8, right: -8 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "18px",
                height: "18px",
                border: `2px solid ${brand.gold}`,
                zIndex: 6,
                ...pos,
              }}
            />
          ))}

          {cameraError ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, ${brand.pinkSoft}, ${brand.pinkBaby})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "rgba(10,10,10,0.5)",
                borderRadius: "1px",
              }}
            >
              <SparkleIcon size={40} color={brand.gold} />
              <span style={{ fontFamily: font.body, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
                Camera not available
              </span>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: "scaleX(-1)",
                borderRadius: "1px",
                backgroundColor: "#111",
              }}
            />
          )}

          <canvas ref={captureRef} style={{ display: "none" }} />

          {(phase === "countdown" || phase === "smile") && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(10,10,10,0.28)",
                zIndex: 8,
              }}
            >
              <div
                style={{
                  fontFamily: font.display,
                  fontWeight: 900,
                  fontSize: phase === "smile" ? "clamp(48px,6vw,80px)" : "clamp(80px,14vw,180px)",
                  fontStyle: phase === "smile" ? "italic" : "normal",
                  color: countdownColor,
                  lineHeight: 1,
                  textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                  transition: "all 0.15s",
                }}
              >
                {countdownText}
              </div>
            </div>
          )}

          {phase === "idle" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(10,10,10,0.45)",
                zIndex: 8,
              }}
            >
              <div
                style={{
                  fontFamily: font.script,
                  fontSize: "32px",
                  color: brand.pinkBaby,
                  marginBottom: "16px",
                  lineHeight: 1,
                }}
              >
                ready, ma chérie?
              </div>
              <button
                onClick={startSession}
                style={{
                  padding: "18px 56px",
                  background: brand.white,
                  color: brand.ink,
                  border: "none",
                  borderRadius: "1px",
                  fontFamily: font.body,
                  fontWeight: 400,
                  fontSize: "12px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
                }}
              >
                Start
              </button>
            </div>
          )}

          {phase === "done" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(10,10,10,0.6)",
                zIndex: 8,
              }}
            >
              <div style={{ fontFamily: font.script, fontSize: "40px", color: brand.gold }}>developing…</div>
            </div>
          )}
        </div>
      </div>

      {phase === "idle" && (
        <div
          style={{
            textAlign: "center",
            paddingBottom: "24px",
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          4 photos · 3-second countdown each
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "28px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          opacity: 0.5,
        }}
      >
        <SparkleIcon size={9} color={brand.pinkBaby} />
        <SparkleIcon size={7} color={brand.gold} />
        <SparkleIcon size={9} color={brand.pinkBaby} />
      </div>
    </div>
  );
}
