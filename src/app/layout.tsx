import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strategic Capacity Diagnostic | Transformation Partners",
  description:
    "A five-minute diagnostic for senior Corporate Affairs leaders. Score your function's value-demonstration maturity against ASX-listed mining and energy peers.",
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
