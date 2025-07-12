
"use client";

import { useState } from "react";
import type { AnalyzeCodeOutput } from "@/ai/flows/analyze-code";
import { runCodeAnalysis } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Binary,
  BookOpen,
  Check,
  ClipboardCopy,
  FileCode,
  Loader2,
  ShieldCheck,
  Wand2,
} from "lucide-react";

export function CodeAnalyzer() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAnalysis(null);
    setIsCopied(false);

    const { data, error } = await runCodeAnalysis(code);

    if (error) {
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: error,
      });
    } else {
      setAnalysis(data);
    }

    setIsLoading(false);
  };

  const handleCopy = () => {
    if (!analysis) return;

    const textToCopy = `
Language: ${analysis.language}

## Explanation
${analysis.explanation}

## Complexity Analysis
${analysis.complexity}

## Security Assessment
${analysis.securityAssessment}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const AnalysisSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/4" />
        </CardContent>
      </Card>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode />
            Code Input
          </CardTitle>
          <CardDescription>
            Enter or paste your code snippet below for AI-powered analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="font-code text-sm h-64 bg-background"
              required
            />
            <Button type="submit" disabled={isLoading || !code} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analyze Code
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <AnalysisSkeleton />}

      {analysis && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>AI-generated insights into your code.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {isCopied ? (
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                )}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                Language
              </h3>
              <Badge variant="secondary" className="text-base">{analysis.language}</Badge>
            </div>

            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Explanation
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{analysis.explanation}</p>
            </div>

            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Binary className="w-5 h-5 text-primary" />
                Complexity Analysis
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{analysis.complexity}</p>
            </div>

            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Security Assessment
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{analysis.securityAssessment}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
