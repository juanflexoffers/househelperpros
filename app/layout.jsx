import "./globals.css";

export const metadata = {
  title: "HouseHelperPros - Find the Best Pros in Your Area",
  description: "Compare quotes and book home projects with trusted local professionals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
