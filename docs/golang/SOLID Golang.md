Open / Closed Principle
```
package main

type A struct {
        year int
}

func (a A) Greet() { fmt.Println("Hello GolangUK", a.year) }

type B struct {
        A
}

func (b B) Greet() { fmt.Println("Welcome to GolangUK", b.year) }

func main() {
        var a A
        a.year = 2016
        var b B
        b.year = 2016
        a.Greet() // Hello GolangUK 2016
        b.Greet() // Welcome to GolangUK 2016
}
```

## Liskov Substitution Principle
 
The Liskov substitution principle states, roughly, that two types are substitutable if they exhibit behaviour such that the caller is unable to tell the difference.
Go does not have classes, or inheritance, so substitution cannot be implemented in terms of an abstract class hierarchy.

#### Instead, substitution is the purview of Go’s `interfaces`.
In Go, types are not required to nominate that they implement a particular interface, instead any type implements an interface simply provided it has methods whose signature matches the interface declaration.
```
type Reader interface {
        // Read reads up to len(buf) bytes into buf.
        Read(buf []byte) (n int, err error)
}
```

## Interface Segregation Principle
The fourth principle is the interface segregation principle, 
"Clients should not be forced to depend on methods they do not use."

In Go, the application of the interface segregation principle can refer to a process of isolating the behaviour required for a function to do its job.
```
// Save writes the contents of doc to the file f.
func Save(f *os.File, doc *Document) error
```

## Dependency Inversion Principle
the final SOLID principle is the dependency inversion principle, which states:
```
High-level modules should not depend on low-level modules. Both should depend on abstractions.
Abstractions should not depend on details. Details should depend on abstractions.
```

 The context of Go, is the structure of your import graph.
 In Go, your import graph must be acyclic. A failure to respect this acyclic requirement is grounds for a compilation failure, but more gravely represents a serious error in design.

[Solid Golang design](https://dave.cheney.net/2016/08/20/solid-go-design)