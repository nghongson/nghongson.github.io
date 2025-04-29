Next.js improves your application's performance and reduces costs by caching rendering work and data requests.

| Mechanism                                                                                                | What                       | Where  | Purpose                                         | Duration                        |
| -------------------------------------------------------------------------------------------------------- | -------------------------- | ------ | ----------------------------------------------- | ------------------------------- |
| [Request Memoization](https://nextjs.org/docs/app/building-your-application/caching#request-memoization) | Return values of functions | Server | Re-use data in a React Component tree           | Per-request lifecycle           |
| [Data Cache](https://nextjs.org/docs/app/building-your-application/caching#data-cache)                   | Data                       | Server | Store data across user requests and deployments | Persistent (can be revalidated) |
| [Full Route Cache](https://nextjs.org/docs/app/building-your-application/caching#full-route-cache)       | HTML and RSC payload       | Server | Reduce rendering cost and improve performance   | Persistent (can be revalidated) |
| [Router Cache](https://nextjs.org/docs/app/building-your-application/caching#router-cache)               | RSC Payload                | Client | Reduce server requests on navigation            | User session or time-based      |

By default,

## Request Memoization

## Data Cache
## Route Cache
## Router Cache

Custom Next.js Cache Handler
[Redis](https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis)