# IoC on typescript

## Lib Inversify

github: [https://github.com/inversify/InversifyJS](https://github.com/inversify/InversifyJS)

## Lib typedi

github: [https://github.com/typestack/typedi](https://github.com/typestack/typedi)

### Container

### @Service

### @Inject

### Types

- Type
- Factory
- Value

### Factory

Using factory class to create service

```typescript
import { Container, Service } from "typedi";

@Service()
class CarFactory {
  constructor(public logger: LoggerService) {}

  create() {
    return new Car("BMW", this.logger);
  }
}

@Service({ factory: [CarFactory, "create"] })
class Car {
  constructor(
    public model: string,
    public logger: LoggerInterface,
  ) {}
}
// Getting service from the container.
// Service will be created by calling the specified factory function.
const car = Container.get(Car);
```

### Custom decorators

Create custom decorators which will inject your given values for your service dependencies.

### Singleton vs transient classes

### Scoped containers

Global scoped

```typescript
@Service({ global: true })

```

### Dependency injection

```typescript
export const PostRepository = Service(() => ({
  getName() {
    return "hello from post repository";
  },
}));

export const PostManager = Service(() => ({
  getId() {
    return "some post id";
  },
}));

export class PostQueryBuilder {
  build() {
    return "SUPER * QUERY";
  }
}

export const PostController = Service(
  [PostManager, PostRepository, PostQueryBuilder],
  (manager, repository, queryBuilder) => {
    return {
      id: manager.getId(),
      name: repository.getName(),
      query: queryBuilder.build(),
    };
  },
);
```

## Lib tsyringe

github: [https://github.com/microsoft/tsyringe](https://github.com/microsoft/tsyringe)

