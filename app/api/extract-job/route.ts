import { auth } from '@clerk/nextjs/server'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobDescription } = await req.json();

  // TODO: Replace this with actual AI extraction logic (OpenAI)
  const fakeExtracted = {
    title: "Social Media Manager",
    company: "RazorFish",
    summary: "Join OpenAI to work on cutting-edge artificial intelligence applications.",
    expectations: "Design scalable backend systems, collaborate with research teams.",
    qualifications: "3+ years experience with TypeScript, strong knowledge of distributed systems.",
  };

  const job = await prisma.job.create({
    data: {
      userId,
      title: fakeExtracted.title,
      company: fakeExtracted.company,
      fullJD: jobDescription,
      summary: fakeExtracted.summary,
      expectations: fakeExtracted.expectations,
      qualifications: fakeExtracted.qualifications,
    },
  });

  return NextResponse.json(job);
}
