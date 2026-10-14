import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GA Quick Personality Test",
  description:
    "A 12-question quick personality test that reveals your MBTI type (E/I, S/N, T/F, J/P) instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
