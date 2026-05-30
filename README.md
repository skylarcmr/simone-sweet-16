# Simone's Sweet 16 — A Night in Paris 💌

A web photobooth for Simone's Sweet 16, August 8.

- **Public booth** — `/` and `/booth`: 4-shot photo session, downloads or prints a Paris-themed strip.
- **Admin** — `/admin`: magic-link login (skylarmcr24@gmail.com), upload PNG templates.
- **Public download** — `/d/[id]`: the URL behind the QR code shown at end of session.

Stack: Next.js 15 · Tailwind 4 · Supabase (auth + storage + Postgres) · Vercel.

See [SETUP.md](./SETUP.md) for first-time setup.

```bash
bun install
cp .env.local.example .env.local   # add Supabase keys
bun run dev
```
