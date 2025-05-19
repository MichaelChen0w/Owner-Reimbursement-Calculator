import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NTHeader } from "@/components/nt-header"
import { NTFooter } from "@/components/nt-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Owner Reimbursement Costs Calculator | NT Government",
  description: "Calculate Owner Reimbursement Costs for crop industries under the Emergency Plant Pest Response Deed",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <NTHeader />
            <main className="flex-grow">{children}</main>
            <NTFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
