# GraphQL Cache
- [caching in graphql](https://daily.dev/blog/caching-in-graphql)

## Strategies for GraphQL caching

## Client cache side
### Reading and writing to the cache
### ApolloClient InMemoryCache
## Server cache side
### Setting cache control for a type
 cache hints to the GraphQL schema
```
 type Author @cacheControl(maxAge: 60) {
  id: Int
  firstName: String
  lastName: String
  posts: [Post] @cacheControl(maxAge: 180)
}
```


```
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // The max age is calculated in seconds
  plugins: [ApolloServerPluginCacheControl({ defaultMaxAge: 5 })],
});
```
### Caching GET requests
Use in CDN

persisted query: Hash SHA256
```
curl --get http://localhost:4000/graphql \
  --header 'content-type: application/json' \
  --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4edb46db40b5132295c0291d62fb65d6759a9eedfa4d5d612dd5ec54a6b38"}}'
```

Send both the query string _and_ its hash,
```
curl --get http://localhost:4000/graphql \
  --header 'content-type: application/json' \
  --data-urlencode 'query={__typename}' \
  --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4edb46db40b5132295c0291d62fb65d6759a9eedfa4d5d612dd5ec54a6b38"}}'
```
## A concept Document Caching `urql` 


