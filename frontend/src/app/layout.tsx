// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../components/Providers";
import { Navbar } from "../components/Navbar";
import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockCred | Cryptographic Proof",
  description: "Zero-Trust Cryptographic Credential Verification System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen`}>
        <Providers>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}