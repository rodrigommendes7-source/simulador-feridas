import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://simulador-feridas.vercel.app"),
  title: {
    default: "Simulador de Tratamento de Feridas",
    template: "%s | Simulador de Tratamento de Feridas",
  },
  description:
    "Plataforma educativa para treino de observação, diálogo clínico e decisão terapêutica no tratamento de feridas.",
  keywords: [
    "tratamento de feridas",
    "simulador clínico",
    "enfermagem",
    "aprendizagem clínica",
    "universidade dos açores",
  ],
  authors: [{ name: "Rodrigo Marques Mendes" }],
  creator: "Rodrigo Marques Mendes",
  applicationName: "Simulador de Tratamento de Feridas",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Simulador de Tratamento de Feridas",
    description:
      "Ferramenta pedagógica para treinar observação, raciocínio clínico e escolha de materiais no tratamento de feridas.",
    type: "website",
    locale: "pt_PT",
    siteName: "Simulador de Tratamento de Feridas",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#081120] text-slate-50">{children}</body>
    </html>
  );
}
