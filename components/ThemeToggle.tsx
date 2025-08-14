'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      className="rounded transition align-middle cursor-pointer"
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={18} className="align-middle hover:text-brand-dark transition" />
      ) : (
        <Moon size={18} className="align-middle hover:text-brand-light transition" />
      )}
    </button>
  )
}
