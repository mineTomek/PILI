import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { mergeCss } from "@/utils/mergeCss";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PILI",
  description: "Personal Item Location Index",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mergeCss(inter.className, "max-w-[60rem] mx-auto bg-white dark:bg-zinc-900 text-black dark:text-zinc-100")}>{children}</body>
    </html>
  );
}
