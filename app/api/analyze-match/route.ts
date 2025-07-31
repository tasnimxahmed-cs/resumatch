// app/api/analyze-match/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateResumeJobMatch } from "@/lib/matching";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, jobId } = await req.json();

    if (!resumeId || !jobId) {
      return NextResponse.json({ 
        error: "Resume ID and Job ID are required" 
      }, { status: 400 });
    }

    // Fetch resume and job data
    const [resume, job] = await Promise.all([
      prisma.resumeVersion.findUnique({
        where: { id: resumeId, userId }
      }),
      prisma.job.findUnique({
        where: { id: jobId, userId }
      })
    ]);

    if (!resume || !job) {
      return NextResponse.json({ 
        error: "Resume or job not found" 
      }, { status: 404 });
    }

    // Calculate match using AI
    const matchResult = await calculateResumeJobMatch(
      resume.content,
      job.fullJD,
      job.title,
      job.company
    );

    if (!matchResult) {
      return NextResponse.json({ 
        error: "Failed to analyze resume-job match" 
      }, { status: 500 });
    }

    // Save or update the analysis
    const existingFeedback = await prisma.gPTFeedback.findUnique({
      where: { resumeId: resume.id }
    });

    const feedbackData = {
      score: matchResult.score,
      suggestions: JSON.stringify({
        strengths: matchResult.strengths,
        gaps: matchResult.gaps,
        suggestions: matchResult.suggestions,
        keywordMatches: matchResult.keywordMatches
      })
    };

    if (existingFeedback) {
      await prisma.gPTFeedback.update({
        where: { resumeId: resume.id },
        data: feedbackData
      });
    } else {
      await prisma.gPTFeedback.create({
        data: {
          ...feedbackData,
          resumeId: resume.id
        }
      });
    }

    return NextResponse.json({
      matchScore: matchResult.score,
      analysis: matchResult,
      resumeFilename: resume.filename,
      jobTitle: `${job.title} @ ${job.company}`
    });

  } catch (error: any) {
    console.error("Match analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze match. Please try again." }, 
      { status: 500 }
    );
  }
}