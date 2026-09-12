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
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased selection:bg-[#E5A838] selection:text-[#000A1B]">
        {children}
      </body>
    </html>
  );
}
