export async function extractTextFromPDF(buffer: Buffer): Promise<string | null> {
  try {
    console.log("PDF buffer received:", buffer.length);
    
    // Dynamic import to avoid module resolution issues
    const pdfParse = (await import('pdf-parse')).default;
    
    // Configure options to avoid file system issues
    const options = {
      // Prevent file system operations
      max: 0, // Parse all pages
    };
    
    const data = await pdfParse(buffer, options);
    
    if (!data || !data.text) {
      console.log("No text extracted from PDF");
      return null;
    }
    
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

    console.log(`Extracted text length: ${text.length}`);
    return text.length > 50 ? text : null;
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // If primary method fails, try alternative approach
    try {
      console.log("Trying alternative PDF parsing method...");
      
      // Try with require instead of import
      const pdfParseRequire = require('pdf-parse');
      const fallbackData = await pdfParseRequire(buffer);
      const fallbackText = fallbackData.text?.trim();
      
      if (fallbackText && fallbackText.length > 50) {
        console.log(`Fallback extraction successful: ${fallbackText.length} characters`);
        return fallbackText;
      }
    } catch (fallbackError) {
      console.error('Fallback PDF parsing also failed:', fallbackError);
    }
    
    return null;
  }
}