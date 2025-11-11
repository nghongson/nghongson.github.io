Token-Oriented Object Notation (TOON)
https://github.com/toon-format/toon
Ex:

```
JSON
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ]
}
=> TOON
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

Nodejs:
https://github.com/toon-format/toon

Golang:
https://github.com/toon-format/toon-go

```
package main

import (
    "fmt"

    "github.com/toon-format/toon-go"
)

type User struct {
    ID    int    `toon:"id"`
    Name  string `toon:"name"`
    Role  string `toon:"role"`
}

type Payload struct {
    Users []User `toon:"users"`
}

func main() {
    in := Payload{
        Users: []User{
            {ID: 1, Name: "Alice", Role: "admin"},
            {ID: 2, Name: "Bob", Role: "user"},
        },
    }

    encoded, err := toon.Marshal(in, toon.WithLengthMarkers(true))
    if err != nil {
        panic(err)
    }
    fmt.Println(string(encoded))

    var out Payload
    if err := toon.Unmarshal(encoded, &out); err != nil {
        panic(err)
    }
    fmt.Printf("first user: %+v\n", out.Users[0])
}
```
