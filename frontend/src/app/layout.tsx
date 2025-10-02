import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import NavBarWrapper from "./components/NavBarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyLens | Drone Filming",
  description: "Apple-style drone filming service website.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-black text-white min-h-screen ${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <NavBarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
