'use server';

/**
 * @fileOverview Analyzes code quality, providing complexity and security ratings.
 *
 * - rateCodeQuality - A function that analyzes code quality.
 * - RateCodeQualityInput - The input type for the rateCodeQuality function.
 * - RateCodeQualityOutput - The return type for the rateCodeQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RateCodeQualityInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
});
export type RateCodeQualityInput = z.infer<typeof RateCodeQualityInputSchema>;

const RateCodeQualityOutputSchema = z.object({
  language: z.string().describe('The detected programming language.'),
  complexityRating: z.string().describe('The complexity rating of the code (e.g., low, medium, high).'),
  securityRating: z.string().describe('The security rating of the code (e.g., low, medium, high).'),
  explanation: z.string().describe('An explanation of the code, its complexity, and security implications.'),
});
export type RateCodeQualityOutput = z.infer<typeof RateCodeQualityOutputSchema>;

export async function rateCodeQuality(input: RateCodeQualityInput): Promise<RateCodeQualityOutput> {
  return rateCodeQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rateCodeQualityPrompt',
  input: {schema: RateCodeQualityInputSchema},
  output: {schema: RateCodeQualityOutputSchema},
  prompt: `You are a code analysis expert. Analyze the following code snippet and provide a complexity and security rating.

Code:
{{code}}

Respond in the following format:
{
  "language": "The detected programming language",
  "complexityRating": "The complexity rating of the code (e.g., low, medium, high)",
  "securityRating": "The security rating of the code (e.g., low, medium, high)",
  "explanation": "An explanation of the code, its complexity, and security implications."
}
`,
});

const rateCodeQualityFlow = ai.defineFlow(
  {
    name: 'rateCodeQualityFlow',
    inputSchema: RateCodeQualityInputSchema,
    outputSchema: RateCodeQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
