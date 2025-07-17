import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const jobs = await prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 [font-family:var(--font-poppins)]">Your Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500 [font-family:var(--font-inter)]">No jobs yet. Upload one to get started.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job: any) => (
            <li key={job.id} className="p-4 rounded-md shadow bg-white dark:bg-surface-dark">
              <h3 className="text-lg font-semibold [font-family:var(--font-poppins)]">{job.title} @ {job.company}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 [font-family:var(--font-inter)]">{job.summary || "No summary yet."}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  ); 
}
