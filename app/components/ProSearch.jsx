"use client";

import { useState } from "react";
import { getClickId } from "../lib/clickid";
import ThumbtackRequestFlowModal from "./ThumbtackRequestFlowModal";

export default function ProSearch({ category = "", buttonLabel = "Compare Quotes" }) {
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);

  async function searchPros(zip) {
    setError("");
    if (!zip) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({ zip });
      if (category) params.set("query", category);
      const clickId = getClickId();
      if (clickId) params.set("clickId", clickId);

      const res = await fetch(`/api/thumbtack/pros?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.error || `Search failed (${res.status})`);
      }
      setPros(Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      setPros([]);
      setError(e?.message || "Failed to search pros");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        className="grid"
        style={{ gridTemplateColumns: "1fr auto", gap: 12, maxWidth: 520 }}
        onSubmit={(e) => {
          e.preventDefault();
          const zip = new FormData(e.currentTarget).get("zip")?.toString()?.trim();
          searchPros(zip);
        }}
      >
        <input
          className="input"
          name="zip"
          inputMode="numeric"
          placeholder="Enter ZIP code"
          aria-label="ZIP code"
        />
        <button className="btn primary" type="submit">
          {buttonLabel}
        </button>
      </form>

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
                <div style={{ color: "var(--muted)", marginTop: 6 }}>
                  {p?.business_name || p?.description || ""}
                </div>
                <div style={{ marginTop: 12, color: "var(--accent)" }}>Request a quote →</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ThumbtackRequestFlowModal
        pro={selectedPro}
        open={!!selectedPro}
        onClose={() => setSelectedPro(null)}
      />
    </>
  );
}
