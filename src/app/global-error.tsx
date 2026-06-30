"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong</title>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
