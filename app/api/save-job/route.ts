import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, company, summary, expectations, qualifications, fullJD } = await req.json();

  if (!title || !company || !fullJD) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      userId,
      title,
      company,
      summary,
      expectations,
      qualifications,
      fullJD,
    },
  });

  return NextResponse.json(job);
}
