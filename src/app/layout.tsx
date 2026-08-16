import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import { AppProvider } from "@/providers/AppProvider";
import { NavigationShell } from "@/components/NavigationShell";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nutria — Nutrición & Ciclo Menstrual",
  description:
    "Registro calórico, macros por porción, ayuno intermitente y sincronización hormonal con estética boutique.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nutria",
  },
};

export const viewport: Viewport = {
  themeColor: "#8E9A76",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="matcha-peach" className={`${fraunces.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-text-main">
        <AppProvider>
          <NavigationShell>{children}</NavigationShell>
        </AppProvider>
      </body>
    </html>
  );
}
