"use client";

import { useState } from "react";
import { getClickId } from "../lib/clickid";
import ThumbtackRequestFlowModal from "./ThumbtackRequestFlowModal";

// Used on the homepage where there is no fixed vertical. On category pages
// (e.g. /bathroom) a `category` prop is passed and the picker is hidden.
const DEFAULT_CATEGORIES = [
  { label: "Bathroom Remodeling", query: "bathroom remodeling" },
  { label: "Kitchen Remodeling", query: "kitchen remodeling" },
  { label: "Roofing", query: "roofing" },
  { label: "Flooring", query: "flooring installation" },
];

export default function ProSearch({
  category = "",
  buttonLabel = "Compare Quotes",
  categories = DEFAULT_CATEGORIES,
}) {
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);

  // When no fixed category is provided, let the user pick one. Thumbtack's
  // businesses/search requires a searchQuery (or categoryID), so a ZIP-only
  // search always fails — the picker guarantees we send one.
  const showCategoryPicker = !category;
  const [pickedQuery, setPickedQuery] = useState(categories[0]?.query || "");

  async function searchPros(zip, query) {
    setError("");
    if (!zip) return;
    if (!query) {
      setError("Please choose a service category.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ zip, query });
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
        style={{
          gridTemplateColumns: showCategoryPicker ? "1fr 1fr auto" : "1fr auto",
          gap: 12,
          maxWidth: showCategoryPicker ? 680 : 520,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const zip = form.get("zip")?.toString()?.trim();
          const query = category || pickedQuery;
          searchPros(zip, query);
        }}
      >
        {showCategoryPicker ? (
          <select
            className="input"
            name="category"
            aria-label="Service category"
            value={pickedQuery}
            onChange={(e) => setPickedQuery(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.query} value={c.query}>
                {c.label}
              </option>
            ))}
          </select>
        ) : null}

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
                key={p?.businessID || p?.businessName}
                type="button"
                className="card"
                onClick={() => setSelectedPro(p)}
                style={{ textAlign: "left" }}
              >
                <div style={{ fontSize: 18, fontWeight: 650 }}>{p?.businessName || "Pro"}</div>
                <div style={{ color: "var(--muted)", marginTop: 6 }}>
                  {p?.businessLocation || ""}
                  {typeof p?.rating === "number" && p.rating > 0
                    ? `${p?.businessLocation ? " · " : ""}★ ${p.rating.toFixed(2)} (${p?.numberOfReviews || 0})`
                    : ""}
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
