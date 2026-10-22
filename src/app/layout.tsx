import type { Metadata } from "next";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/bebas-neue/latin-400.css";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "Dutch Beatbox Battle | Nederlands Kampioenschap Human Beatbox",
  description:
    "Dutch Beatbox Battle is het officiële Nederlands Kampioenschap Human Beatbox en het platform voor beatboxers in Nederland. Ontdek battles, jams, academy, sessions en events.",
  keywords: [
    "Dutch Beatbox Battle",
    "DBB",
    "Nederlands Kampioenschap Beatbox",
    "human beatbox Nederland",
    "beatbox battle Nederland",
    "beatbox academy",
    "loopstation battle",
  ],
  openGraph: {
    title: "Dutch Beatbox Battle | Nederlands Kampioenschap Human Beatbox",
    description:
      "Het officiële Nederlands Kampioenschap Human Beatbox en het platform voor de Nederlandse beatboxcommunity.",
    type: "website",
    locale: "nl_NL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head></head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
