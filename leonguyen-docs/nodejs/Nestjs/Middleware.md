# Middleware in Nestjs
Middleware is a function which is called before the route handler.
Nest middleware are, by default, equivalent to express middleware.
![[Pasted image 20240608180252.png]]
## Application-level middleware

```typescript
const express = require('express')
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

or

app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```
## Router-level middleware
```

```

## Error-handling middleware


## Nestjs middleware apply
### implement custom Nest middleware 
```typescript

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}



```

### Function middleware 
```typescript
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};


```
### Applying middleware
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
	  // or Apply
	consumer
	  .apply(logger)
	  .forRoutes(CatsController);
  }
}
```
### Middleware consumer
The MiddlewareConsumer is a helper class. It provides several built-in methods to manage middleware

### Multiple middleware
```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```
### Global middleware
```typescript
// Use express
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

