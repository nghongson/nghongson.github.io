# Middleware

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
