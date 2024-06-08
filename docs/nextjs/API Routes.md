# Route API

cookies
`import { cookies } from 'next/headers'`
header
`import { headers } from 'next/headers'`

`import type { NextApiRequest, NextApiResponse } from 'next'`


Route Segment Config

| Option                                                                                                               | Type                                                                                                                      | Default                    |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| [`dynamic`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)                 | `'auto' \| 'force-dynamic' \| 'error' \| 'force-static'`                                                                  | `'auto'`                   |
| [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams)     | `boolean`                                                                                                                 | `true`                     |
| [`revalidate`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate)           | `false \| 0 \| number`                                                                                                    | `false`                    |
| [`fetchCache`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#fetchcache)           | `'auto' \| 'default-cache' \| 'only-cache' \| 'force-cache' \| 'force-no-store' \| 'default-no-store' \| 'only-no-store'` | `'auto'`                   |
| [`runtime`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#runtime)                 | `'nodejs' \| 'edge'`                                                                                                      | `'nodejs'`                 |
| [`preferredRegion`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#preferredregion) | `'auto' \| 'global' \| 'home' \| string \| string[]`                                                                      | `'auto'`                   |
| [`maxDuration`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#maxduration)         | `number`                                                                                                                  | Set by deployment platform |

```typescript
layout.tsx | page.tsx | route.ts

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
 
export default function MyComponent() {}
```