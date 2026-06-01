import Link from "next/link";
import ProSearch from "../components/ProSearch";

export const metadata = {
  title: "Bathroom Remodel Pros Near You — HouseHelperPros",
  description: "Compare quotes from local bathroom remodeling professionals in your area.",
};

export default function Page() {
  return (
    <main>
      <div className="section">
        <div className="container">
          <Link href="/" style={{ color: "var(--muted)" }}>← Back</Link>
          <h1 className="h1" style={{ fontSize: 42 }}>Bathroom Pros Near You</h1>
          <p className="p">
            Compare free quotes from top-rated local bathroom remodelers. Enter your ZIP to see
            available pros in your area.
          </p>
          <div style={{ marginTop: 18 }}>
            <ProSearch category="bathroom remodeling" buttonLabel="Get Bathroom Quotes" />
          </div>
        </div>
      </div>
    </main>
  );
}
