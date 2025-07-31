// lib/matching.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface MatchResult {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
}

export async function calculateResumeJobMatch(
  resumeContent: string,
  jobDescription: string,
  jobTitle: string,
  company: string
): Promise<MatchResult | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert ATS (Applicant Tracking System) and career counselor. Analyze how well this resume matches the job requirements.

JOB DETAILS:
Title: ${jobTitle}
Company: ${company}
Description: ${jobDescription}

RESUME CONTENT:
${resumeContent}

Provide a comprehensive analysis in the following JSON format:
{
  "score": 85,
  "strengths": [
    "Strong experience in required technologies",
    "Leadership experience matches job requirements"
  ],
  "gaps": [
    "Missing experience with specific framework mentioned",
    "Could use more quantified achievements"
  ],
  "suggestions": [
    "Add specific metrics to demonstrate impact",
    "Include keywords like 'machine learning' and 'data analysis'",
    "Reorganize experience section to highlight relevant projects first"
  ],
  "keywordMatches": {
    "matched": ["JavaScript", "React", "Node.js", "team leadership"],
    "missing": ["Python", "Docker", "CI/CD", "Agile methodology"]
  }
}

SCORING CRITERIA:
- 90-100: Excellent match, resume strongly aligns with all requirements
- 80-89: Good match, minor gaps that are easily addressable
- 70-79: Decent match, some important gaps to address
- 60-69: Fair match, significant improvements needed
- Below 60: Poor match, major restructuring required

Focus on:
1. Technical skills alignment
2. Experience level match
3. Industry relevance
4. Keyword optimization for ATS
5. Achievement quantification
6. Cultural fit indicators

Be honest but constructive. Provide actionable suggestions.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const match = text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);
    if (!match) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const jsonStr = match[1]?.trim() || match[0];
    const parsed = JSON.parse(jsonStr);

    // Validate the response structure
    if (typeof parsed.score !== 'number' || 
        !Array.isArray(parsed.strengths) ||
        !Array.isArray(parsed.gaps) ||
        !Array.isArray(parsed.suggestions)) {
      throw new Error("Invalid response structure from AI");
    }

    return parsed as MatchResult;

  } catch (error: any) {
    console.error("Resume matching error:", error);
    return null;
  }
}

export async function generateResumeSuggestions(
  resumeContent: string,
  targetJob?: {
    title: string;
    company: string;
    description: string;
  }
): Promise<string[] | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const jobContext = targetJob 
      ? `Target Job: ${targetJob.title} at ${targetJob.company}\nJob Description: ${targetJob.description}\n\n`
      : '';

    const prompt = `
You are a professional resume writer with 15+ years of experience. Analyze this resume and provide specific, actionable improvement suggestions.

${jobContext}RESUME CONTENT:
${resumeContent}

Provide 5-8 specific suggestions to improve this resume${targetJob ? ' for the target job' : ''}. 
Focus on:
- Content improvements (skills, experience, achievements)
- Formatting and structure
- Keyword optimization
- Quantifying achievements
- ATS optimization
${targetJob ? '- Tailoring for the specific role and company' : ''}

Return only a JSON array of strings:
[
  "Add specific metrics to quantify your achievements (e.g., 'Increased sales by 25%' instead of 'Increased sales')",
  "Include more relevant keywords from the job description in your skills section",
  "Reorganize experience bullets to lead with your most impressive accomplishments"
]

Each suggestion should be:
- Specific and actionable
- Focused on one improvement area
- Immediately implementable
- Professionally written
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      throw new Error("Failed to extract JSON array from response");
    }

    const parsed = JSON.parse(match[0]);
    
    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }

    return parsed.filter(suggestion => typeof suggestion === 'string' && suggestion.length > 10);

  } catch (error: any) {
    console.error("Resume suggestions error:", error);
    return null;
  }
}