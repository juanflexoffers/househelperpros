import Link from \"next/link\";

export default function Page() {
  return (
    <main>
      <div className=\"section\">
        <div className=\"container\">
          <Link href=\"/\" style={{ color: \"var(--muted)\" }}>? Back</Link>
          <h1 className=\"h1\" style={{ fontSize: 42 }}>Roofing Pros Near You</h1>
          <p className=\"p\">Compare quotes from local Roofing professionals in your area.</p>
        </div>
      </div>
    </main>
  );
}