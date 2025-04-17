import "./globals.css";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Simple Chat",
  description: "A simple chat application",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
