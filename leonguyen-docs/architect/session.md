# Session 
## What is session?
## Session & Cookies
Session server side
Cookie client side (browser)
## Session-Based vs. Token-Based Authentication

### Express session
```
import * as session from 'express-session';

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}))
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})
```
Redis
```
npm install redis connect-redis express-session

import RedisStore from "connect-redis"
import session from "express-session"
import {createClient} from "redis"

// Initialize client.
let redisClient = createClient()
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
  }),
)

```
### NestJs
```
import * as session from 'express-session';
// somewhere in your initialization file
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    store: new redisStore({...}),
  }),
);
```

```
@Get()
findAll(@Req() request: Request) {
  request.session.visits = request.session.visits ? request.session.visits + 1 : 1;
}
@Get()
findAll(@Session() session: Record<string, any>) {
  session.visits = session.visits ? session.visits + 1 : 1;
}
```
### Gin session
```
package main

import (
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  store := cookie.NewStore([]byte("secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/hello", func(c *gin.Context) {
    session := sessions.Default(c)

    if session.Get("hello") != "world" {
      session.Set("hello", "world")
      session.Save()
    }

    c.JSON(200, gin.H{"hello": session.Get("hello")})
  })
  r.Run(":8000")
}
```
**cookie-based**
```
package main

import (
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  store := cookie.NewStore([]byte("secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/incr", func(c *gin.Context) {
    session := sessions.Default(c)
    var count int
    v := session.Get("count")
    if v == nil {
      count = 0
    } else {
      count = v.(int)
      count++
    }
    session.Set("count", count)
    session.Save()
    c.JSON(200, gin.H{"count": count})
  })
  r.Run(":8000")
}
```
**Redis**
```
package main

import (
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  store, _ := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/incr", func(c *gin.Context) {
    session := sessions.Default(c)
    var count int
    v := session.Get("count")
    if v == nil {
      count = 0
    } else {
      count = v.(int)
      count++
    }
    session.Set("count", count)
    session.Save()
    c.JSON(200, gin.H{"count": count})
  })
  r.Run(":8000")
}
```
### Go fiber session
```
import (
  "github.com/gofiber/fiber/v3"
  "github.com/gofiber/fiber/v3/middleware/session"
)

// Initialize default config
// This stores all of your app's sessions
store := session.New()

app.Get("/", func(c fiber.Ctx) error {
    // Get session from storage
    sess, err := store.Get(c)
    if err != nil {
        panic(err)
    }

    // Get value
    name := sess.Get("name")

    // Set key/value
    sess.Set("name", "john")

    // Get all Keys
    keys := sess.Keys()

    // Delete key
    sess.Delete("name")

    // Destroy session
    if err := sess.Destroy(); err != nil {
        panic(err)
    }

	// Sets a specific expiration for this session
	sess.SetExpiry(time.Second * 2)

    // Save session
    if err := sess.Save(); err != nil {
		panic(err)
	}

	return c.SendString(fmt.Sprintf("Welcome %v", name))
})
```

```
Default Config
var ConfigDefault = Config{
	Expiration:   24 * time.Hour,
	KeyLookup:    "cookie:session_id",
	KeyGenerator: utils.UUIDv4,
	source:       "cookie",
	sessionName:  "session_id",
}


Constants
const (
	SourceCookie   Source = "cookie"
	SourceHeader   Source = "header"
	SourceURLQuery Source = "query"
)
```

Custom Storage/Database
```
import "github.com/gofiber/storage/redis/v3"
// Initialize default config
storage := redis.New()

// Initialize custom config
storage := redis.New(redis.Config{
	Host:      "127.0.0.1",
	Port:      6379,
	Username:  "",
	Password:  "",
	Database:  0,
	Reset:     false,
	TLSConfig: nil,
	PoolSize:  10 * runtime.GOMAXPROCS(0),
})
store := session.New(session.Config{
	Storage: storage,
})
```

## Ref:
- [session](http://www.senchalabs.org/connect/session.html)
- 