import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import NotFound from "./[lang]/not-found";

/*
  The page for an address that matches no route at all, such as /nl/typo. It
  skips the normal layout, so it brings its own html, fonts and styles, and
  reuses the same Dutch not-found screen as a missing project page.
*/
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Pagina niet gevonden | Sharply",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
    >
      <body>
        <NotFound />
      </body>
    </html>
  );
}
