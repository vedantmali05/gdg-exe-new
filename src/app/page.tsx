import { TerminalSquare } from 'lucide-react';
import { CodeAnalyzer } from '@/components/code-analyzer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-2">
              <TerminalSquare className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
                GDGExecutor
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Your AI-powered code analysis assistant.
            </p>
          </header>

          <CodeAnalyzer />
        </div>
      </div>
      <footer className="text-center p-6 text-sm text-muted-foreground">
        <p>Powered by GenAI</p>
      </footer>
    </div>
  );
}
