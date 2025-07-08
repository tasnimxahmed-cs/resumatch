import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="text-2xl font-bold font-header">
          Resu<span className="text-brand-light dark:text-brand-dark">Match</span>
        </div>
        <div className="space-x-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition font-body">
            Launch App
          </Link>
          <Link href="/demo" className="text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition font-body">
            Try Demo
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-8xl font-bold mb-4 tracking-tight font-header">
          Resu<span className="text-brand-light dark:text-brand-dark">Match</span>
        </h1>
        <p className="text-2xl text-text-light dark:text-text-dark mb-8 font-body">
          Tailor smarter. Match better.
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="bg-brand-light dark:bg-brand-dark text-text-dark px-6 py-3 rounded-lg shadow hover:bg-brand-light/75 dark:hover:bg-brand-dark/75 transition font-body"
          >
            Launch App
          </Link>
          <Link
            href="/demo"
            className="bg-bg-dark dark:bg-bg-light text-brand-dark px-6 py-3 rounded-lg hover:bg-bg-dark/75 dark:hover:bg-bg-light/75 transition font-body shadow"
          >
            Try Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
