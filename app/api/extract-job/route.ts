import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { extractJobInfoFromLink } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobLink } = await req.json();

  if (!jobLink || !jobLink.startsWith("http")) {
    return NextResponse.json({ error: "Invalid or missing job link." }, { status: 400 });
  }

  const extracted = await extractJobInfoFromLink(jobLink);

  if (!extracted) {
    return NextResponse.json(
      { error: "Failed to extract job info from the link. Try another one or paste the description manually." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ...extracted });
}
