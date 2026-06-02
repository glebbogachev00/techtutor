import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AchievementToaster from "@/components/AchievementToaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TechBash — Learn to Code · by TechTutor",
  description:
    "TechBash is the self-paced coding portal from TechTutor Academy. Web development & Python missions with instant AI feedback for kids 8–15.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pattern-bg">
        {children}
        <AchievementToaster />
      </body>
    </html>
  );
}
