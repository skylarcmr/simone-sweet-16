// Seed templates from local PNGs directly into Supabase.
// Bun reads .env.local automatically.
// Usage: bun run scripts/seed-templates.mjs <name1>=<path1> <name2>=<path2> ...
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE env vars (.env.local)");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: bun run scripts/seed-templates.mjs <name>=<path> [<name>=<path> ...]");
  process.exit(1);
}

for (const arg of args) {
  const [name, ...rest] = arg.split("=");
  const filePath = rest.join("=");
  if (!name || !filePath) {
    console.error(`Bad arg: ${arg}`);
    continue;
  }
  console.log(`\nUploading "${name}" from ${filePath}...`);
  const buf = await readFile(filePath);
  const storagePath = `${randomUUID()}.png`;
  const { error: upErr } = await sb.storage
    .from("templates")
    .upload(storagePath, buf, { contentType: "image/png", upsert: false });
  if (upErr) {
    console.error(`  upload failed: ${upErr.message}`);
    continue;
  }
  const { error: dbErr } = await sb.from("templates").insert({
    name,
    storage_path: storagePath,
    active: true,
  });
  if (dbErr) {
    console.error(`  db insert failed: ${dbErr.message}`);
    await sb.storage.from("templates").remove([storagePath]);
    continue;
  }
  console.log(`  ok → ${storagePath}`);
}

console.log("\nDone. Listing all templates:");
const { data: list } = await sb.from("templates").select("id, name, active, created_at").order("created_at");
console.table(list ?? []);
