"use client";

import ThemeToggle from "@/components/ThemeToggle"
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow">
      <h1 className="text-xl font-semibold [font-family:var(--font-poppins)]">Resu<span className="text-brand-light dark:text-brand-dark">Match</span></h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
