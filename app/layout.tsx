import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dental Lab",
  description: "Dental Lab - atencion dental cercana y profesional con la Dra. Astrid Carolina Vergara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
