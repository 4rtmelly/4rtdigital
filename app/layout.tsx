import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Header } from "./components/header/Header"
import { Footer } from "./components/footer/Footer"

const anticDidone = localFont({
  src: "./fonts/AnticDidone-Regular.ttf",
  variable: "--font-anticDidone",
})

const inter = localFont({
  src: [{ path: "./fonts/Inter_28pt-Light.ttf" }],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "4rt digital gallery",
  description: "Digital art gallery",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anticDidone.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
