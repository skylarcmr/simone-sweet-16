"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type CameraHandle = { capture: () => string | null };

type Props = { mirrored?: boolean };

export const Camera = forwardRef<CameraHandle, Props>(function Camera({ mirrored = true }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "camera blocked");
      }
    })();
    return () => { active = false; stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  useImperativeHandle(ref, () => ({
    capture: () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !ready) return null;
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 960;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      if (mirrored) { ctx.translate(w, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, 0, 0, w, h);
      return canvas.toDataURL("image/jpeg", 0.92);
    },
  }), [ready, mirrored]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-sm">
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center">
          <p className="font-display text-lg tracking-widest mb-2">CAMERA UNAVAILABLE</p>
          <p className="text-sm opacity-80">{error}</p>
          <p className="text-xs mt-4 opacity-60">Allow camera access and reload.</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline muted
          style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});
