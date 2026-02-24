import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { ProjectContentProvider } from "./components/ProjectContentContext";
import Navigation from "./components/navigation";
import Home from "./components/home";
import Info from "./info/info";
import Contact from "./contact/contact";
import { Syne } from "next/font/google";
import BottomInfo from "./components/bottomInfo";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Again Again Studio",
  description:
    "A place where we invite people to wander into new artistic territories. To try, to tinker, and to begin again as many times as they wish.",
  metadataBase: new URL("https://againagain.studio/"),
  openGraph: {
    title: "Again Again Studio",
    description:
      "A place where we invite people to wander into new artistic territories. To try, to tinker, and to begin again as many times as they wish.",
    url: "https://againagain.studio/",
    siteName: "Again Again Studio",
    images: [
      {
        url: "https://againagain.studio/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Again Again Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Again Again Studio",
    description:
      "A place where we invite people to wander into new artistic territories. To try, to tinker, and to begin again as many times as they wish.",
    images: ["https://againagain.studio/opengraph.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-256.png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon-256.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-(--kiln-fire) text-(--bisqueware) selection:bg-(--bisqueware) selection:text-(--kiln-fire)`}
      >
        <main className="fixed w-screen h-screen overflow-hidden">
          <ProjectContentProvider>
            <ViewTransitions>
              <Navigation />
              {/* <InfoContainer /> */}
              <Contact />
              <Home />
              <Info />
              {children}
              <BottomInfo />
            </ViewTransitions>
          </ProjectContentProvider>
        </main>
      </body>
    </html>
  );
}
