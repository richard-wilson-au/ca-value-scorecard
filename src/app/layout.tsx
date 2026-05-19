import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://strategic-capacity-diagnostic.vercel.app";
const TITLE = "Strategic Capacity Diagnostic | Transformation Partners";
const DESCRIPTION =
  "A five-minute diagnostic for senior Corporate Affairs leaders. Score your function's value-demonstration maturity against ASX-listed mining and energy peers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Transformation Partners",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
