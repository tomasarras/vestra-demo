import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/components/AdminProvider";
import { CartProvider } from "@/components/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vestra — Demo de tienda de ropa",
  description:
    "Proyecto de portfolio: tienda de ropa ficticia con catálogo, carrito y cupones de descuento, y un panel de administración para cargar productos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AdminProvider>
          <CartProvider>{children}</CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
