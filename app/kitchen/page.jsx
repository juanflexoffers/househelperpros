import Link from "next/link";

function ZipCta() {
  return (
    <form className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 12, maxWidth: 520 }}>
      <input className="input" name="zip" inputMode="numeric" placeholder="Enter ZIP code" aria-label="ZIP code" />
      <button className="btn primary" type="submit">Get Kitchen Quotes</button>
    </form>
  );
}

export default function Page() {
  return (
    <main>
      <div className="section">
        <div className="container">
          <Link href="/" style={{ color: "var(--muted)" }}>? Back</Link>
          <h1 className="h1" style={{ fontSize: 42 }}>Kitchen Pros Near You</h1>
          <p className="p">Compare quotes from local Kitchen professionals in your area.</p>
          <ZipCta />
        </div>
      </div>
    </main>
  );
}