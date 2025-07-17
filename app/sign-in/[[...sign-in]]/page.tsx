'use client'

import { SignIn } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Page() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: isDark ? '#8C7CFF' : '#6C4EFF',
            colorBackground: isDark ? '#2A2A33' : '#FFFFFF',
            colorText: isDark ? '#F3F4F6' : '#1F2937',
            colorTextOnPrimaryBackground: '#F3F4F6',
          },
          elements: {
            socialButtonsBlockButton: 'bg-[var(--color-brand-light)] text-[var(--color-text-dark)] hover:bg-[#6C4EFF]/80 dark:bg-[var(--color-brand-dark)] dark:text-[var(--color-text-dark)] dark:hover:bg-[#8C7CFF]/80'
          }
        }}
      />
    </main>
  )
}
