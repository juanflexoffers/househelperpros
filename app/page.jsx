import Link from "next/link";

const categories = [
  { slug: "roofing", title: "Roofing", blurb: "Repairs, replacements, inspections." },
  { slug: "flooring", title: "Flooring", blurb: "LVP, hardwood, tile, carpet." },
  { slug: "bathroom", title: "Bathroom", blurb: "Renovations, showers, vanities." },
  { slug: "kitchen", title: "Kitchen", blurb: "Remodels, cabinets, countertops." },
];

function ZipCta({ label = "Compare Quotes" }) {
  return (
    <form className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 12, maxWidth: 520 }}><input className="input" name="zip" inputMode="numeric" placeholder="Enter ZIP code" aria-label="ZIP code" /><button className="btn primary" type="submit">{label}</button></form>
  );
}

export default function Page() {
  return (
    <main><div className="section"><div className="container"><div className="badge">Every project has a pro</div><h1 className="h1">Find the Best Pro in Your Area</h1><p className="p">
            Compare quotes from local top-rated experts and schedule your project - without the endless searching.
          </p><div style={{ marginTop: 18 }}><ZipCta /></div></div></div><hr className="hr" /><div className="section"><div className="container"><h2 style={{ margin: "0 0 10px" }}>Top Home Improvement Projects</h2><p className="p" style={{ marginTop: 0 }}>Start with a category - we'll tailor the next step.</p><div className="grid cols4" style={{ marginTop: 18 }}>
            {categories.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="card"><div style={{ fontSize: 18, fontWeight: 650 }}>{c.title}</div><div style={{ color: "var(--muted)", marginTop: 6 }}>{c.blurb}</div><div style={{ marginTop: 12, color: "var(--accent)" }}>Get quotes →</div></Link>
            ))}
          </div></div></div></main>
  );
}
