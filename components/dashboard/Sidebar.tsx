"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Upload,
  FileText,
  FilePlus,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Jobs", href: "/dashboard", icon: Briefcase },
  { name: "Upload Job", href: "/dashboard/upload-job", icon: FilePlus },
  { name: "Upload Resume", href: "/dashboard/upload-resume", icon: Upload },
  { name: "Resumes", href: "/dashboard/resumes", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-surface-light dark:bg-surface-dark">
      <nav className="flex flex-col gap-2 p-6">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-brand-light hover:text-text-dark dark:hover:bg-brand-dark [font-family:var(--font-inter)] ${
              pathname === href ? "bg-brand-light text-text-dark dark:bg-brand-dark" : ""
            }`}
          >
            <Icon size={18} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
