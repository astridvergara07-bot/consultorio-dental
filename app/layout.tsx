import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "[Nombre del Consultorio]",
  description: "Consultorio de odontologia - atencion dental cercana y profesional.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
