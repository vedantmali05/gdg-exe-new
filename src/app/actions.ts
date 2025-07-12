
"use server";

import { analyzeCode, type AnalyzeCodeOutput } from "@/ai/flows/analyze-code";

export async function runCodeAnalysis(
  code: string
): Promise<{ data: AnalyzeCodeOutput | null; error: string | null }> {
  if (!code || code.trim() === "") {
    return { data: null, error: "Code snippet cannot be empty." };
  }

  try {
    const result = await analyzeCode({ code });
    return { data: result, error: null };
  } catch (e) {
    console.error("AI analysis failed:", e);
    return { data: null, error: "An error occurred during analysis. Please try again." };
  }
}
