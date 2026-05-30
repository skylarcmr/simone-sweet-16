"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Check, LogOut } from "lucide-react";
import { uploadTemplate, setActiveTemplate, deleteTemplate, signOut } from "./actions";
import { SparkleIcon, MiniEiffelSVG } from "@/components/illustrations";

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

type T = { id: string; name: string; storage_path: string; active: boolean; created_at: string; previewUrl?: string };

export default function AdminPanel({ email, templates }: { email: string; templates: T[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [nameFocused, setNameFocused] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    setUploadError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreviewFile(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleUpload = () => {
    if (!name.trim()) {
      setUploadError("Please enter a template name.");
      return;
    }
    if (!file) {
      setUploadError("Please choose a PNG file.");
      return;
    }
    setUploadError("");
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("file", file);
    start(async () => {
      const res = await uploadTemplate(fd);
      if (res?.error) {
        setUploadError(res.error);
        return;
      }
      setName("");
      setFile(null);
      setPreviewFile(null);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  };

  const setActive = (id: string) => {
    start(async () => {
      await setActiveTemplate(id);
      router.refresh();
    });
  };

  const removeTemplate = (id: string, displayName: string) => {
    if (!confirm(`Delete "${displayName}"?`)) return;
    start(async () => {
      await deleteTemplate(id);
      router.refresh();
    });
  };

  return (
    <div style={{ fontFamily: font.body, backgroundColor: brand.cream, minHeight: "100vh", color: brand.ink }}>
      {/* Header */}
      <header
        style={{
          padding: "20px 48px",
          borderBottom: "1px solid rgba(10,10,10,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: brand.white,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <MiniEiffelSVG size={28} />
          <div>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: "18px", color: brand.ink }}>
              Templates
            </div>
            <div style={{ fontFamily: font.script, fontSize: "14px", color: brand.pinkBaby, lineHeight: 1 }}>
              bonjour, {email.split("@")[0]}
            </div>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: font.body,
              fontWeight: 300,
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(10,10,10,0.4)",
            }}
          >
            <LogOut size={13} strokeWidth={1.5} /> Sign Out
          </button>
        </form>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 48px 80px" }}>
        {/* Upload card */}
        <div
          style={{
            background: brand.white,
            border: "1px solid rgba(10,10,10,0.07)",
            borderRadius: "2px",
            padding: "36px 40px",
            marginBottom: "48px",
            boxShadow: "0 4px 24px rgba(10,10,10,0.04)",
          }}
        >
          <h2
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.32em",
              textTransform: "uppercase" as const,
              color: brand.ink,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <SparkleIcon size={10} /> Upload New Template
          </h2>

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: "10px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase" as const,
                  color: "rgba(10,10,10,0.45)",
                  marginBottom: "8px",
                }}
              >
                Template Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder="e.g. Paris Nights"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: `2px solid ${nameFocused ? brand.pinkBaby : "rgba(10,10,10,0.12)"}`,
                  borderRadius: "1px",
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: "14px",
                  color: brand.ink,
                  background: "transparent",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box" as const,
                }}
              />
            </div>

            <div style={{ flex: "2 1 300px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: "10px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase" as const,
                  color: "rgba(10,10,10,0.45)",
                  marginBottom: "8px",
                }}
              >
                PNG Template (600×1800px)
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  border: "2px dashed rgba(10,10,10,0.18)",
                  borderRadius: "1px",
                  cursor: "pointer",
                  background: previewFile ? brand.pinkSoft : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <Upload size={16} color={brand.gold} strokeWidth={1.5} />
                <span style={{ fontFamily: font.body, fontWeight: 300, fontSize: "13px", color: "rgba(10,10,10,0.5)" }}>
                  {previewFile ? `${file?.name} ✓` : "Choose PNG file…"}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {previewFile && (
                <div
                  style={{
                    width: "50px",
                    height: "150px",
                    backgroundImage: `url(${previewFile})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid rgba(10,10,10,0.1)",
                    borderRadius: "1px",
                  }}
                />
              )}
              <button
                onClick={handleUpload}
                disabled={pending}
                style={{
                  padding: "13px 28px",
                  background: brand.ink,
                  color: brand.white,
                  border: "none",
                  borderRadius: "1px",
                  fontFamily: font.body,
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase" as const,
                  cursor: pending ? "not-allowed" : "pointer",
                  opacity: pending ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {pending ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>

          {uploadError && (
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: "11px",
                color: "#c0392b",
                marginTop: "12px",
                letterSpacing: "0.04em",
              }}
            >
              {uploadError}
            </p>
          )}
        </div>

        {/* Templates grid */}
        <h2
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase" as const,
            color: brand.ink,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <SparkleIcon size={10} color={brand.pinkBaby} /> All Templates
          <span
            style={{
              fontFamily: font.body,
              fontWeight: 300,
              color: "rgba(10,10,10,0.35)",
              fontSize: "10px",
              letterSpacing: "0.1em",
            }}
          >
            ({templates.length})
          </span>
        </h2>

        {templates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px",
              border: "2px dashed rgba(10,10,10,0.1)",
              borderRadius: "2px",
            }}
          >
            <div style={{ fontFamily: font.script, fontSize: "28px", color: brand.pinkBaby, marginBottom: "8px" }}>
              no templates yet
            </div>
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: "12px",
                letterSpacing: "0.1em",
                color: "rgba(10,10,10,0.4)",
              }}
            >
              Upload your first template above
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "24px" }}>
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  background: brand.white,
                  border: tpl.active ? `2px solid ${brand.gold}` : "1px solid rgba(10,10,10,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  boxShadow: tpl.active ? "0 0 0 3px rgba(212,175,107,0.18)" : "0 4px 20px rgba(10,10,10,0.04)",
                  transition: "all 0.25s",
                  position: "relative",
                }}
              >
                {tpl.active && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: brand.pinkBaby,
                      color: brand.ink,
                      fontFamily: font.body,
                      fontWeight: 400,
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      zIndex: 2,
                    }}
                  >
                    Active
                  </div>
                )}

                <div style={{ width: "100%", aspectRatio: "1/3", position: "relative", background: brand.pinkSoft }}>
                  {tpl.previewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={tpl.previewUrl}
                      alt={tpl.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: brand.white }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        background: `linear-gradient(180deg, ${brand.pinkSoft} 0%, ${brand.cream} 100%)`,
                      }}
                    >
                      <SparkleIcon size={20} color={brand.gold} />
                      <div style={{ fontFamily: font.script, fontSize: "16px", color: brand.gold }}>Simone</div>
                      <SparkleIcon size={12} color={brand.pinkBaby} />
                    </div>
                  )}
                </div>

                <div style={{ padding: "14px 16px 16px" }}>
                  <div
                    style={{
                      fontFamily: font.display,
                      fontWeight: 700,
                      fontSize: "13px",
                      color: brand.ink,
                      marginBottom: "4px",
                    }}
                  >
                    {tpl.name}
                  </div>
                  <div
                    style={{
                      fontFamily: font.body,
                      fontWeight: 300,
                      fontSize: "10px",
                      color: "rgba(10,10,10,0.35)",
                      letterSpacing: "0.08em",
                      marginBottom: "14px",
                    }}
                  >
                    Added {tpl.created_at?.slice(0, 10) ?? "—"}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {!tpl.active ? (
                      <button
                        onClick={() => setActive(tpl.id)}
                        disabled={pending}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "none",
                          border: "none",
                          cursor: pending ? "not-allowed" : "pointer",
                          fontFamily: font.body,
                          fontWeight: 400,
                          fontSize: "10px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase" as const,
                          color: brand.gold,
                          padding: 0,
                        }}
                      >
                        <Check size={12} strokeWidth={2} /> Set Active
                      </button>
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontFamily: font.body,
                          fontWeight: 400,
                          fontSize: "10px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase" as const,
                          color: brand.gold,
                        }}
                      >
                        <Check size={12} strokeWidth={2} /> Active
                      </span>
                    )}
                    <span style={{ flex: 1 }} />
                    <button
                      onClick={() => removeTemplate(tpl.id, tpl.name)}
                      disabled={pending}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "none",
                        border: "none",
                        cursor: pending ? "not-allowed" : "pointer",
                        fontFamily: font.body,
                        fontWeight: 300,
                        fontSize: "10px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "rgba(10,10,10,0.35)",
                        padding: 0,
                      }}
                    >
                      <Trash2 size={11} strokeWidth={1.5} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Print spec note */}
        <div
          style={{
            marginTop: "48px",
            padding: "20px 24px",
            background: "rgba(212,175,107,0.07)",
            border: "1px solid rgba(212,175,107,0.25)",
            borderRadius: "2px",
          }}
        >
          <p
            style={{
              fontFamily: font.body,
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "rgba(10,10,10,0.5)",
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            <strong style={{ fontWeight: 400, color: brand.gold }}>Print spec:</strong>{" "}
            Templates must be PNG, 600×1800px with transparent photo windows. The booth composites photos beneath the overlay automatically. Active template applies to all new strips.
          </p>
        </div>
      </div>
    </div>
  );
}
