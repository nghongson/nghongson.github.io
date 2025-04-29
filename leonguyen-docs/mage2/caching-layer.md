# Caching layer for Magento services

Cache is one of the most important parts in a modern web application architecture. Magento caching layer should effectively improve:
- Performance
- Availability
- Scalability

Caching should be implemented on several levels:
- Caching of http-responses returned by BFF (Backend for Frontend)
- Application data caching (results of DB queries, merged configurations etc.)

BFF http-responses contains static assets, public and private dynamic content. Static assets should be cached using CDN. Reverse proxy should cache public content. It could be Varnish (acts as reverse proxy) or Fastly (combines reverse proxy and CDN functions). Varnish and Fastly are already integrated with Magento. Reverse proxy uses lazy caching approach. Beside performance this type of cache has next benefits

- Protection against outages - can optionally serve stale content when there is a problem with origin server
- Scalability - number of caching nodes can be increased
- Flexibility – Varnish Configuration Language (VCL) builds customized solutions, rules and modules


