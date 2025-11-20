import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "커리어 플랫폼 - 맞춤형 커리어 로드맵",
  description: "직장인/취준생을 위한 취업/이직/커리어 전환 맞춤 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


