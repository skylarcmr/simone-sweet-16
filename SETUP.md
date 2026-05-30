# Simone's Sweet 16 — Photobooth Setup

A Next.js + Supabase + Vercel photobooth. Auto-uploads strips, shows a QR code
guests can scan to download to their phone, and prints 4×6 sheets in the booth.

## What you'll need

| | What | Cost |
|---|---|---|
| 1 | A **GitHub** account | free |
| 2 | A **Supabase** project | free tier covers this |
| 3 | A **Vercel** account | free hobby plan |

No Twilio, no SMS, no per-message cost. Guests scan a QR with their phone camera and download instantly.

---

## 1. Local development

```bash
cd simone-sweet-16
bun install
cp .env.local.example .env.local   # edit with your Supabase keys (see below)
bun run dev
```

Visit http://localhost:3000.

---

## 2. Supabase setup (~5 minutes)

1. Go to https://supabase.com → **New project**.
   - Name: `simone-sweet-16`
   - Pick a strong DB password and save it
   - Region: closest to where the party will be (US East works for east-coast parties)
2. Once the project is ready:
   - **Settings → API** → copy `Project URL`, `anon public` key, and `service_role` key into `.env.local`.
3. **SQL Editor → New Query** → paste the contents of `supabase-setup.sql` → Run.
4. **Storage**:
   - Click **New bucket** → name `templates`, **Private**, create.
   - Click **New bucket** → name `strips`, **Public**, create.
5. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` for now (change to your Vercel URL after deploy).
   - Redirect URLs: add `http://localhost:3000/auth/callback` and (later) `https://your-vercel-url.vercel.app/auth/callback`.
6. **Authentication → Providers**: make sure Email is enabled (it is by default). No SMTP needed for magic links — Supabase sends them.

---

## 3. First admin login

1. With the dev server running, go to http://localhost:3000/admin → enter `skylarmcr24@gmail.com`.
2. Check Gmail for a magic link from Supabase, click it.
3. You should land on the admin dashboard. Upload your first template PNG.

### Template format

- 600×1800 px PNG with **transparent windows** where you want photos to show through.
- Anything opaque (text, ribbons, the gold border) will print on top of the photos.
- Design in Canva → "Download as PNG" → "Transparent background" → upload here.
- Set one as **Active** — that's the one applied to every strip until you change it.

---

## 4. Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/simone-sweet-16.git
   git branch -M main
   git push -u origin main
   ```
2. https://vercel.com → **Add New → Project** → import the GitHub repo.
3. **Environment Variables** — paste every key from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS=skylarmcr24@gmail.com`
4. Deploy. Note the URL (e.g. `simone-sweet-16.vercel.app`).
5. Back in **Supabase → Authentication → URL Configuration**:
   - Set **Site URL** to your Vercel URL.
   - Add `https://YOUR-VERCEL-URL.vercel.app/auth/callback` to the Redirect URLs.

Done. Every push to `main` redeploys automatically.

---

## 5. Day-of-event tips

- **Use a tablet or laptop** at the booth running `/booth` in fullscreen.
- **Wi-Fi reliability** matters — without internet, the QR upload step fails. (The
  download / print buttons still work as fallbacks.)
- **Print** uses the browser print dialog at 4"×6" — connect a photo printer
  (e.g. Canon Selphy or DNP DS-RX1) and pick the matching paper size.
- **Test your active template** at home before the party. Take a session, scan
  the QR, print a sheet — make sure everything prints with the alignment you expect.
