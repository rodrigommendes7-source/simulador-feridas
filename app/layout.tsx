import "./globals.css";

export const metadata = {
  title: "Simulador de Tratamento de Feridas",
  description: "Plataforma interativa para treino de decisão clínica",
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
