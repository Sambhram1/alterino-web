import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alterino - College Project Showcase Platform",
  description: "Showcase your college projects and connect with the tech community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0D1117] text-white`}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1F2937",
                color: "#F9FAFB",
                border: "1px solid #374151",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#F9FAFB",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#F9FAFB",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
