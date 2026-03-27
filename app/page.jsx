"use client";

import Link from "next/link";
import { useState } from "react";
import ThumbtackRequestFlowModal from "./components/ThumbtackRequestFlowModal";

const categories = [
  { slug: "roofing", title: "Roofing", blurb: "Repairs, replacements, inspections." },
  { slug: "flooring", title: "Flooring", blurb: "LVP, hardwood, tile, carpet." },
  { slug: "bathroom", title: "Bathroom", blurb: "Renovations, showers, vanities." },
  { slug: "kitchen", title: "Kitchen", blurb: "Remodels, cabinets, countertops." },
];

function ZipCta({ label = "Compare Quotes", onSubmit }) {
  return (
    <form
      className="grid"
      style={{ gridTemplateColumns: "1fr auto", gap: 12, maxWidth: 520 }}
      onSubmit={(e) => {
        e.preventDefault();
        const zip = new FormData(e.currentTarget).get("zip")?.toString()?.trim();
        onSubmit?.(zip);
      }}
    >
      <input className="input" name="zip" inputMode="numeric" placeholder="Enter ZIP code" aria-label="ZIP code" />
      <button className="btn primary" type="submit">
        {label}
      </button>
    </form>
  );
}

export default function Page() {
  const [zip, setZip] = useState("");
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);

  async function searchPros(nextZip) {
    setError("");
    setZip(nextZip || "");
    if (!nextZip) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/thumbtack/pros?zip=${encodeURIComponent(nextZip)}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.error || `Search failed (${res.status})`);
      }

      // Thumbtack response has a `data` key per docs.
      setPros(Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      setPros([]);
      setError(e?.message || "Failed to search pros");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="section">
        <div className="container">
          <div className="badge">Every project has a pro</div>
          <h1 className="h1">Find the Best Pro in Your Area</h1>
          <p className="p">Compare quotes from local top-rated experts and schedule your project - without the endless searching.</p>
          <div style={{ marginTop: 18 }}>
            <ZipCta label="Compare Quotes" onSubmit={searchPros} />
          </div>

          {loading ? <p className="p" style={{ marginTop: 12 }}>Searching…</p> : null}
          {error ? (
            <p className="p" style={{ marginTop: 12, color: "#b91c1c" }}>
              {error}
            </p>
          ) : null}

          {pros?.length ? (
            <div style={{ marginTop: 18 }}>
              <h2 style={{ margin: "0 0 10px" }}>Available Pros</h2>
              <div className="grid cols4">
                {pros.map((p) => (
                  <button
                    key={p?.id || p?.business_id || p?.name}
                    type="button"
                    className="card"
                    onClick={() => setSelectedPro(p)}
                    style={{ textAlign: "left" }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 650 }}>{p?.name || "Pro"}</div>
                    <div style={{ color: "var(--muted)", marginTop: 6 }}>{p?.business_name || p?.description || ""}</div>
                    <div style={{ marginTop: 12, color: "var(--accent)" }}>Request a quote →</div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <ThumbtackRequestFlowModal pro={selectedPro} open={!!selectedPro} onClose={() => setSelectedPro(null)} />
        </div>
      </div>

      <hr className="hr" />

      <div className="section">
        <div className="container">
          <h2 style={{ margin: "0 0 10px" }}>Top Home Improvement Projects</h2>
          <p className="p" style={{ marginTop: 0 }}>Start with a category - we'll tailor the next step.</p>
          <div className="grid cols4" style={{ marginTop: 18 }}>
            {categories.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="card">
                <div style={{ fontSize: 18, fontWeight: 650 }}>{c.title}</div>
                <div style={{ color: "var(--muted)", marginTop: 6 }}>{c.blurb}</div>
                <div style={{ marginTop: 12, color: "var(--accent)" }}>Get quotes →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
