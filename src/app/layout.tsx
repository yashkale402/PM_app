// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers"; // we'll define a providers wrapper
// Optionally import a Navbar, etc.

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PM App",
  overview: "Project Management App with Next.js and MongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Optionally add <Navbar /> */}
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
