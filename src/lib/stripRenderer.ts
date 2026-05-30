// Renders a 4×1 photobooth strip onto a canvas, optionally with a template overlay.
// Output: 600×1800 px = 2"×6" @ 300 DPI (single strip).
// For print, see renderPrintSheet — produces a 1200×1800 (4"×6") with two strips side-by-side.

export type StripOpts = {
  photos: string[];          // dataURLs (4 photos)
  templateUrl?: string;      // optional transparent PNG laid OVER the photos
};

const STRIP_W = 600;
const STRIP_H = 1800;
const PAD = 30;
const GAP = 14;
const PHOTO_W = STRIP_W - PAD * 2;
const PHOTO_H = (STRIP_H - PAD * 2 - GAP * 3 - 200 /* footer */) / 4;

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderStrip({ photos, templateUrl }: StripOpts): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = STRIP_W;
  canvas.height = STRIP_H;
  const ctx = canvas.getContext("2d")!;

  // White paper background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);

  // Place 4 photos
  const imgs = await Promise.all(photos.map(loadImg));
  imgs.slice(0, 4).forEach((img, i) => {
    const x = PAD;
    const y = PAD + i * (PHOTO_H + GAP);

    // Photo border (gold)
    ctx.fillStyle = "#d4af6b";
    ctx.fillRect(x - 2, y - 2, PHOTO_W + 4, PHOTO_H + 4);

    // Cover-fit
    const ratio = Math.max(PHOTO_W / img.width, PHOTO_H / img.height);
    const dw = img.width * ratio;
    const dh = img.height * ratio;
    const dx = x + (PHOTO_W - dw) / 2;
    const dy = y + (PHOTO_H - dh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, PHOTO_W, PHOTO_H);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  });

  // Default footer (only used when no template overlay)
  if (!templateUrl) {
    const fy = STRIP_H - 180;
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "italic 56px 'Allura', cursive";
    ctx.textAlign = "center";
    ctx.fillText("Simone", STRIP_W / 2, fy + 60);

    ctx.font = "600 22px 'Playfair Display', serif";
    ctx.fillStyle = "#d4af6b";
    ctx.fillText("· SWEET SIXTEEN ·", STRIP_W / 2, fy + 95);

    ctx.font = "400 14px 'Montserrat', sans-serif";
    ctx.fillStyle = "#0a0a0a";
    ctx.fillText("A NIGHT IN PARIS  ·  AUGUST 8", STRIP_W / 2, fy + 125);

    ctx.font = "400 11px 'Montserrat', sans-serif";
    ctx.fillStyle = "#888";
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    ctx.fillText(date.toUpperCase(), STRIP_W / 2, fy + 150);
  }

  // Apply template overlay if present
  if (templateUrl) {
    try {
      const tmpl = await loadImg(templateUrl);
      ctx.drawImage(tmpl, 0, 0, STRIP_W, STRIP_H);
    } catch (e) {
      console.warn("template overlay failed to load", e);
    }
  }

  return canvas;
}

// Print sheet: 4×6 inches @ 300 DPI = 1200×1800. Two identical strips side-by-side.
export async function renderPrintSheet(opts: StripOpts): Promise<HTMLCanvasElement> {
  const strip = await renderStrip(opts);
  const sheet = document.createElement("canvas");
  sheet.width = 1200;
  sheet.height = 1800;
  const ctx = sheet.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1200, 1800);
  ctx.drawImage(strip, 0, 0);
  ctx.drawImage(strip, 600, 0);
  // dashed cut line down the middle
  ctx.strokeStyle = "#c9c0b3";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(600, 20);
  ctx.lineTo(600, 1780);
  ctx.stroke();
  return sheet;
}
