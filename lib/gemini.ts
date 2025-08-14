import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractJobInfoFromLink(link: string) {
  try {
    const res = await fetch(link, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0; +https://example.com/bot)",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const SELECTORS = [
      '[itemtype="http://schema.org/JobPosting"] [itemprop="description"]',
      '[itemtype*="JobPosting"] [itemprop*="description"]',
      '.job-description',
      '.job_content',
      '.job-posting',
      '.posting-body',
      '.description-content',
      'article.job',
      'section.job-details',
      'section.job-description',
      'div[id*="job"]',
      'div[class*="job"]',
      'article[role="main"]',
    ];

    let jobContent = '';

    for (const selector of SELECTORS) {
      const el = $(selector).first();
      if (el && el.text().trim().length > 100) {
        el.find('script, style, noscript, iframe').remove();
        jobContent = el.text().trim()
          .replace(/\s\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .replace(/^\s+|\s+$/g, '');
        break;
      }
    }

    // Fallback to main/body if all else fails
    if (!jobContent) {
      const fallback = $('main').length ? $('main') : $('body');
      fallback.find('script, style, noscript, iframe').remove();
      jobContent = fallback.text().trim()
        .replace(/\s\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/^\s+|\s+$/g, '');
    }

    if (jobContent.length < 100) {
      throw new Error("Unable to extract meaningful content from page.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert job description parser. Given the following job listing, extract the following:
- Job Title
- Company Name
- 1-2 sentence Summary
- Key Expectations (bulleted or comma-separated)
- Key Qualifications (bulleted or comma-separated)

Return only a JSON object in this format:
{
  "title": "",
  "company": "",
  "summary": "",
  "expectations": "",
  "qualifications": ""
}

Here is the job listing:
---
${jobContent}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const match = text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Failed to extract JSON from Gemini response");

    const jsonStr = match[1]?.trim() || match[0];
    const parsed = JSON.parse(jsonStr);

    return {
      ...parsed,
      fullJD: jobContent,
    };
  } catch (error: unknown) {
    console.error("extractJobInfoFromLink error:", error);
    return null;
  }
}
