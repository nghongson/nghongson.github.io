
 the file public/avatars/me.png can be viewed by visiting the /avatars/me.png path. The code to display that image might look like:

```typescript
import Image from 'next/image'
 
export function Avatar({ id, alt }) {
  return <Image src={`/avatars/${id}.png`} alt={alt} width="64" height="64" />
}
```

Caching

Robots, Favicons, and others

manifest.json

sitemap.xml
