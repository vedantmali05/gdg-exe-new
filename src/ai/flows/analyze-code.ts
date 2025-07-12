'use server';

/**
 * @fileOverview Code analysis AI agent.
 *
 * - analyzeCode - A function that handles the code analysis process.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
});
export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  explanation: z.string().describe('An explanation of what the code does.'),
  complexity: z.string().describe('The time and space complexity of the code.'),
  securityAssessment: z.string().describe('A security assessment of the code.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are a senior software engineer and security expert. Analyze the given code snippet and provide the following information:

1.  Language: Identify the programming language of the code.
2.  Explanation: Explain what the code does in simple terms.
3.  Complexity: Analyze the time and space complexity of the code.
4.  Security Assessment: Assess the code for potential security vulnerabilities.

Code Snippet:
\`\`\`{{{code}}}\`\`\``,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
