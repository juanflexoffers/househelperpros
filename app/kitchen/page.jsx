import Link from "next/link";
import ProSearch from "../components/ProSearch";

export const metadata = {
  title: "Kitchen Remodel Pros Near You — HouseHelperPros",
  description: "Compare quotes from local kitchen remodeling professionals in your area.",
};

export default function Page() {
  return (
    <main>
      <div className="section">
        <div className="container">
          <Link href="/" style={{ color: "var(--muted)" }}>← Back</Link>
          <h1 className="h1" style={{ fontSize: 42 }}>Kitchen Pros Near You</h1>
          <p className="p">
            Compare free quotes from top-rated local kitchen remodelers. Enter your ZIP to see
            available pros in your area.
          </p>
          <div style={{ marginTop: 18 }}>
            <ProSearch category="kitchen remodeling" buttonLabel="Get Kitchen Quotes" />
          </div>
        </div>
      </div>
    </main>
  );
}
