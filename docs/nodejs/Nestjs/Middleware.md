# Middleware in Nestjs
Middleware is a function which is called before the route handler.
Nest middleware are, by default, equivalent to express middleware.

## Application-level middleware

```
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

