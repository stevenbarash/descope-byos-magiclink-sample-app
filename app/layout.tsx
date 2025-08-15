import type React from "react"
import { AuthProvider } from "@descope/nextjs-sdk"
import "./globals.css"

export const metadata = {
  title: "Descope Custom Screens",
  description: "Custom authentication screens with Descope",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        style={{
          fontFamily: '"Reith Sans", "Arial", "Helvetica", sans-serif',
          backgroundColor: '#11100A',
          color: '#ffffff'
        }}
        suppressHydrationWarning={true}
      >
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || ""}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}