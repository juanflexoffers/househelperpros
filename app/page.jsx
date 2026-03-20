import Link from \"next/link\";

const categories = [
  { slug: \"roofing\", title: \"Roofing\", blurb: \"Repairs, replacements, inspections.\" },
  { slug: \"flooring\", title: \"Flooring\", blurb: \"LVP, hardwood, tile, carpet.\" },
  { slug: \"bathroom\", title: \"Bathroom\", blurb: \"Renovations, showers, vanities.\" },
  { slug: \"kitchen\", title: \"Kitchen\", blurb: \"Remodels, cabinets, countertops.\" },
];

export default function Page() {
  return (
    <main>
      <div className=\"section\">
        <div className=\"container\">
          <div className=\"badge\">Every project has a pro</div>
          <h1 className=\"h1\">Find the Best Pro in Your Area</h1>
          <p className=\"p\">Compare quotes from local top-rated experts and schedule your project - without the endless searching.</p>
          <div className=\"grid cols4\" style={{ marginTop: 18 }}>
            {categories.map((c) => (
              <Link key={c.slug} href={/} className=\"card\">
                <div style={{ fontSize: 18, fontWeight: 650 }}>{c.title}</div>
                <div style={{ color: \"var(--muted)\", marginTop: 6 }}>{c.blurb}</div>
                <div style={{ marginTop: 12, color: \"var(--accent)\" }}>Get quotes ?</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}