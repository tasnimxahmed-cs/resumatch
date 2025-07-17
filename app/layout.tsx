import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-poppins' })

export const metadata = {
  title: 'Your App',
  description: '...',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark`}
      >
        <ClerkProvider appearance={{
          cssLayerName: 'clerk',
        }}>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
