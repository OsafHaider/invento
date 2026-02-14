import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

const sharpFont = localFont({
  variable: "--font-sharp",
  src: [
    { path: "../fonts/SharpGrotesk-Book20.otf", weight: "400" },
    { path: "../fonts/SharpGrotesk-Medium20.otf", weight: "500" },
  ],
});

export const metadata: Metadata = {
  title: "Invento - Inventory Management",
  description: "Manage your inventory with Invento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sharpFont.className}>
        <AuthProvider>
          <Navbar />
          <main className="w-full overflow-hidden">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
