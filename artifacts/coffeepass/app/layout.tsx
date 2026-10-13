import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CoffeePass",
  description: "CODED course project starter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
