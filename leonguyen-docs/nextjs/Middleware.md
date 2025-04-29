# Middleware

## Use Cases

- Authentication and Authorization
- Server-Side Redirects: Redirect users at the server level based on certain conditions (e.g., locale, user role).
- Path Rewriting: Support A/B testing, feature rollouts, or legacy paths by dynamically rewriting paths to API routes or pages based on request properties.
- Bot Detection: Protect your resources by detecting and blocking bot traffic.
- Logging and Analytics: Capture and analyze request data for insights before processing by the page or API.
- Feature Flagging: Enable or disable features dynamically for seamless feature rollouts or testing.

## Middleware may not be the optimal approach

- Complex Data Fetching and Manipulation: Middleware is not designed for direct data fetching or manipulation, this should be done within Route Handlers or server-side utilities instead.
- Heavy Computational Tasks
- Extensive Session Management (Middleware should just management basic session)
- Direct Database Operations: Performing direct database operations within Middleware is not recommended. Database interactions should done within Route Handlers or server-side utilities.

### Example middleware.ts

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/about/:path*",
};
```

### wrapper-middleware.ts

```typescript
import { NextMiddleware } from "next/server";

export type WrapMiddlewareParams = {
  middleware?: NextMiddleware;
};

export interface WrapMiddleware {
  (params: AuthMiddlewareParams): NextMiddleware;
}

const createWrapperMiddleware: WrapMiddleware = (
  params: WrapMiddlewareParams,
) => {
  const { middleware } = params;
  return async function middlewareWrapper(
    ...args
  ): Promise<NextMiddlewareResult> {
    const [request, event] = args;
    const { pathname } = request.nextUrl;

    if (middleware) {
      return middleware(...args);
    }
  };
};
export { createAuthMiddleware };
```

## Redirects bloom filter

```typescript

import { ScalableBloomFilter } from 'bloom-filters'
```
