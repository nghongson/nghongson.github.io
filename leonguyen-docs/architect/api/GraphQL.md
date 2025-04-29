# Graphql 
GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data.
GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.
A GraphQL service is created by defining types and fields on those types, then providing functions for each field on each type.
1. Ask for what you need, get exactly that.
2. Get many resources in a single request.
3. Describe what's possible with a type system.
## Queries and Mutations
## Schemas and Types
## Validation

Fields
Arguments
Aliases
Fragments
Operation name
Variables
Variable definitions
Default variables
```
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```
