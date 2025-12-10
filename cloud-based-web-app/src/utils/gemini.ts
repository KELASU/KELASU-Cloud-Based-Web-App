import { GenerativeModel, GenerateContentResult } from "@google/generative-ai";

/**
 * Wraps the Gemini generateContent call with retry logic for 429 errors.
 * @param model - The initialized Gemini GenerativeModel instance
 * @param prompt - The prompt string or parts array
 * @param retries - Number of retries to attempt (default 3)
 * @param initialDelay - Initial delay in ms (default 2000ms)
 * @returns The GenerateContentResult
 */
export async function generateContentWithRetry(
  model: GenerativeModel,
  prompt: string | any,
  retries = 3,
  initialDelay = 2000
): Promise<GenerateContentResult> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error: any) {
      if (
        error.status === 429 || 
        error.response?.status === 429 || 
        error.status === 503 ||
        error.message?.includes('429')
      ) {
        attempt++;
        
        if (attempt >= retries) {
          throw new Error(`Gemini API Quota Exceeded after ${retries} attempts: ${error.message}`);
        }

        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`Gemini 429/503 hit. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Failed to generate content after retries.");
}