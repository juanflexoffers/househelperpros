import Link from "next/link";
import ProSearch from "../components/ProSearch";

export const metadata = {
  title: "Roofing Pros Near You — HouseHelperPros",
  description: "Compare quotes from local roofing professionals in your area.",
};

export default function Page() {
  return (
    <main>
      <div className="section">
        <div className="container">
          <Link href="/" style={{ color: "var(--muted)" }}>← Back</Link>
          <h1 className="h1" style={{ fontSize: 42 }}>Roofing Pros Near You</h1>
          <p className="p">
            Compare free quotes from top-rated local roofing pros. Enter your ZIP to see
            available pros in your area.
          </p>
          <div style={{ marginTop: 18 }}>
            <ProSearch category="roofing" buttonLabel="Get Roofing Quotes" />
          </div>
        </div>
      </div>
    </main>
  );
}
