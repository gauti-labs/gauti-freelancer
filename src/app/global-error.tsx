"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Hexagon } from "@/components/ui/hexagon";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-base text-ink">
        <div className="flex min-h-screen items-center justify-center px-4 py-24 text-center">
          <div>
            <Hexagon size={72} className="mx-auto">
              <span className="font-display text-xl text-gold">!</span>
            </Hexagon>
            <h1 className="mt-8 font-display text-4xl font-medium">Something went wrong</h1>
            <p className="mt-4 max-w-md text-ink-muted">
              An unexpected error occurred. Please try again.
            </p>
            <div className="mt-10">
              <Button onClick={reset} variant="primary">
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
