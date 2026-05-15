import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeuFluxo — ERP para MEI",
  description: "Sistema de gestão para Microempreendedor Individual",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
