import Link from "next/link";

function ZipCta() {
  return (
    <form className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 12, maxWidth: 520 }}><input className="input" name="zip" inputMode="numeric" placeholder="Enter ZIP code" aria-label="ZIP code" /><button className="btn primary" type="submit">Get Bathroom Quotes</button></form>
  );
}

export default function Page() {
  return (
    <main><div className="section"><div className="container"><Link href="/" style={{ color: "var(--muted)" }}>← Back</Link><h1 className="h1" style={{ fontSize: 42 }}>Bathroom Pros Near You</h1><p className="p">Compare quotes from local Bathroom professionals in your area.</p><div style={{ marginTop: 18 }}><ZipCta /></div></div></div></main>
  );
}
