import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "JR FISIOTERAPIA | Sistema de Gestão Clínica e Multidisciplinar",
  description:
    "Plataforma inteligente e integrada de gestão para clínicas de fisioterapia, reabilitação física e bem-estar.",
  keywords: [
    "JR Fisioterapia",
    "Gestão Clínica",
    "Fisioterapia",
    "Prontuário Eletrônico",
    "Agendamento Clínico",
  ],
  authors: [{ name: "JR Fisioterapia Engenharia" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
