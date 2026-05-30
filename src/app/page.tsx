"use client";
import Link from "next/link";
import { EiffelScene } from "@/components/illustrations/EiffelScene";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="font-display text-xl tracking-[0.3em]">
          <span className="text-gold-foil font-bold">SIMONE</span>
          <span className="opacity-50 mx-2">·</span>
          <span className="font-light">SWEET 16</span>
        </div>
        <nav className="hidden sm:flex gap-6 font-sans text-xs uppercase tracking-[0.25em]">
          <a href="#about" className="hover:text-[var(--color-pink-deep)]">About</a>
          <a href="#how" className="hover:text-[var(--color-pink-deep)]">How</a>
          <Link href="/admin" className="hover:text-[var(--color-pink-deep)] opacity-60">Admin</Link>
        </nav>
      </header>

      <section className="flex-1 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6 py-8 items-center w-full">
        <div className="space-y-6">
          <p className="font-script text-4xl text-[var(--color-pink-deep)] rotate-[-3deg]" style={{ fontFamily: "Allura, cursive" }}>
            a night in Paris
          </p>
          <h1 className="font-display text-6xl md:text-7xl font-bold leading-[1.0]">
            <span className="block">Simone is</span>
            <span className="block ribbon">turning sweet</span>
            <span className="block text-gold-foil text-8xl md:text-9xl font-black italic">16</span>
          </h1>
          <p className="text-lg text-[var(--color-ink-soft)] max-w-md leading-relaxed">
            Step into the booth, strike four poses, and walk away with a
            keepsake strip from the night. <span className="sparkle">printed or texted, the souvenir is yours</span>
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/booth"
              className="bg-[var(--color-ink)] text-[var(--color-paper)] font-display font-semibold tracking-[0.3em] px-9 py-4 rounded-sm hover:bg-[var(--color-pink-deep)] transition shadow-lg"
            >
              ENTER THE BOOTH
            </Link>
            <span className="font-script text-2xl text-[var(--color-gold)] rotate-[2deg]" style={{ fontFamily: "Allura, cursive" }}>
              ← it's free, ma chérie
            </span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-ink-soft)] opacity-60 pt-2">
            august 8 · save the night
          </p>
        </div>

        <div className="max-w-md mx-auto w-full">
          <EiffelScene onEnter={() => (window.location.href = "/booth")} />
        </div>
      </section>

      <section id="how" className="max-w-6xl mx-auto px-6 py-16 w-full">
        <h2 className="font-display text-3xl tracking-[0.3em] text-center mb-12 uppercase">
          <span className="sparkle">comment ça marche</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Pose", d: "Click in, allow camera access, press start." },
            { n: "02", t: "Smile (×4)", d: "Three… two… one… and snap. Four shots, one strip." },
            { n: "03", t: "Print or Text", d: "Walk away with your strip — printed in-booth or texted to your phone." },
          ].map(s => (
            <div key={s.n} className="border border-[var(--color-ink)]/10 bg-white/60 backdrop-blur-sm p-6 rounded-sm shadow-sm">
              <div className="font-script text-5xl text-gold-foil leading-none" style={{ fontFamily: "Allura, cursive" }}>{s.n}</div>
              <h3 className="font-display font-semibold text-2xl mt-2">{s.t}</h3>
              <p className="text-[var(--color-ink-soft)] mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="about" className="border-t border-[var(--color-ink)]/15 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--color-ink-soft)]">
          <p className="font-script text-xl text-[var(--color-pink-deep)]" style={{ fontFamily: "Allura, cursive" }}>
            xoxo, the booth
          </p>
          <p className="tracking-[0.3em] uppercase text-xs">simone's sweet sixteen · paris · viii · viii</p>
        </div>
      </footer>
    </main>
  );
}
