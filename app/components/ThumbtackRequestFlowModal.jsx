"use client";

import { useEffect, useMemo, useState } from "react";

export default function ThumbtackRequestFlowModal({ pro, open, onClose }) {
  const src = useMemo(() => pro?.widgets?.requestFlowURL || "", [pro]);

  // Basic escape-to-close + body scroll lock
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Request a quote"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "grid",
        placeItems: "center",
        padding: 18,
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "min(980px, 100%)",
          height: "min(760px, 100dvh - 36px)",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 12px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ fontWeight: 650 }}>
            {pro?.name ? `Request a quote — ${pro.name}` : "Request a quote"}
          </div>
          <button className="btn" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {src ? (
          <iframe
            title="Thumbtack Request Flow"
            src={src}
            style={{ width: "100%", height: "100%", border: 0 }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div style={{ padding: 16, color: "var(--muted)" }}>
            Missing Request Flow URL.
          </div>
        )}
      </div>
    </div>
  );
}
