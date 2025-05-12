import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Definición de tus fuentes locales (Geist Sans y Geist Mono)
const geistSans = localFont({
  src: "./fonts/GeistVF.woff", // Asegúrate que esta ruta es correcta dentro de tu proyecto
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff", // Asegúrate que esta ruta es correcta dentro de tu proyecto
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadatos actualizados para el proyecto
export const metadata: Metadata = {
  title: "Gestor de Archivos | Vercel Blob", // Título más descriptivo
  description: "Sube, visualiza y gestiona tus archivos fácilmente con Vercel Blob.", // Descripción acorde al proyecto
  icons: {
    icon: "https://r3hmpzqpd69hxuq9.public.blob.vercel-storage.com/1be5c901758da537fc4b94f97d50ef52-35M6J4ARw6UMsdQb8OanFy1qANjnbT.png", // URL de tu ícono .png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Cambiado lang a "es" para español
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased"> {/* Las variables de fuente ya están en <html>, no es necesario repetirlas aquí a menos que quieras un scope más específico */}
        {children}
      </body>
    </html>
  );
}