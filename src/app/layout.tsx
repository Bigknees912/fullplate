import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Full Plate YYC — Feeding Calgary, 3× at a time",
  description:
    "Full Plate YYC is a Calgary nonprofit that turns every $1 donated into 3× its value in food, in partnership with the Calgary Food Bank.",
  openGraph: {
    title: "Full Plate YYC",
    description:
      "Every $1 becomes 3× in food for Calgary families. Donate, volunteer, and help us fill more plates.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f1e8] text-[#2b2320]">
        {children}
      </body>
    </html>
  );
}
