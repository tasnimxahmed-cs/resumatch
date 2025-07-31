import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string | null> {
  try {
    console.log("PDF buffer received:", buffer.length);
    const data = await pdf(buffer);
    
    // Clean up the extracted text
    let text = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();

    // Remove common PDF artifacts
    text = text
      .replace(/^\d+\s*$/gm, '') // Remove page numbers on their own lines
      .replace(/^[^\w\n]*$/gm, '') // Remove lines with only special characters
      .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks

    return text.length > 50 ? text : null;
  } catch (error) {
    console.error('PDF parsing error:', error);
    return null;
  }
}