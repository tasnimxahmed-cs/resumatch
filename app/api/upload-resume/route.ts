import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf-parser";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobId = formData.get("jobId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extractedText = await extractTextFromPDF(buffer);

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ 
        error: "Could not extract meaningful text from PDF. Please try a different file." 
      }, { status: 400 });
    }

    // Save to database
    const resumeVersion = await prisma.resumeVersion.create({
      data: {
        filename: file.name,
        content: extractedText,
        jobId: jobId || null,
        userId,
      },
    });

    return NextResponse.json({
      id: resumeVersion.id,
      filename: resumeVersion.filename,
      extractedLength: extractedText.length,
      message: "Resume uploaded successfully"
    });

  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Failed to process resume. Please try again." }, 
      { status: 500 }
    );
  }
}