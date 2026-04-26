import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <html lang="nl" className={`${geistSans.variable} ${geistMono.variable}`}>
            <head>

            </head>
            <body suppressHydrationWarning className="antialiased">
                <ClientBody>{children}</ClientBody>
            </body>
        </html>
    );
}
