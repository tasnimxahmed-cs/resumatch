import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if job exists and belongs to user
    const job = await prisma.job.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Use a transaction to handle cascading deletes properly
    await prisma.$transaction(async (tx) => {
      // First, get all resume versions associated with this job
      const resumeVersions = await tx.resumeVersion.findMany({
        where: { jobId: id },
        select: { id: true },
      });

      // Delete GPTFeedback records for all associated resume versions
      if (resumeVersions.length > 0) {
        const resumeIds = resumeVersions.map(rv => rv.id);
        await tx.gPTFeedback.deleteMany({
          where: {
            resumeId: {
              in: resumeIds,
            },
          },
        });
      }

      // Delete resume versions associated with this job
      await tx.resumeVersion.deleteMany({
        where: { jobId: id },
      });

      // Delete any other records that reference this job directly
      // Add more deleteMany calls here if needed for other tables

      // Finally, delete the job
      await tx.job.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const job = await prisma.job.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}