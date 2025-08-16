import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SQLInsights - Transform Text into SQL",
  description:
    "Convert your natural language queries into powerful SQL statements and stunning visualizations instantly",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Convert your natural language queries into powerful SQL statements and stunning visualizations instantly" />
        <meta name="generator" content="v0.app" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
