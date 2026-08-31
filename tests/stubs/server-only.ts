// No-op stub replacing Next.js "server-only" in the test environment.
// The real package throws at import time if included in a client bundle;
// under Vitest we run everything in Node so the guard is unnecessary.
export {};
