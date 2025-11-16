import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: "Lumen - AI-Powered Nutrition Tracking",
  description: "Track nutrition effortlessly with AI-powered meal logging. Hit your goals with confidence using smart analytics and beautiful insights.",
  manifest: "/manifest.json",
  keywords: ["nutrition tracking", "meal logging", "AI nutrition", "macro tracking", "diet app", "health app"],
  authors: [{ name: "Lumen" }],
  openGraph: {
    title: "Lumen - AI-Powered Nutrition Tracking",
    description: "Track nutrition effortlessly with AI-powered meal logging",
    url: "https://sharpened.cc",
    siteName: "Lumen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen - AI-Powered Nutrition Tracking",
    description: "Track nutrition effortlessly with AI-powered meal logging",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-ocean-900 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
