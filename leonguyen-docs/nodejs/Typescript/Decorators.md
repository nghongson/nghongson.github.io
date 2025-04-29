# Typescript Decorators 

### Decorator Factories
### Decorator Composition
### Decorator Evaluation

## Class Decorators
```

```
## Method Decorators
```typescript
/**
 * Get or set Configuration on a class.
 *
 * @decorator
 */
export function methodDecorator(value: string): Function {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
      var context = this;
      var args = arguments;
      originalMethod.apply(context, args);
    };
  };
}


Class A {
  @methodDecorator('test')
  methodA() {
	console.log("methodA")
  }
}
```
## Accessor Decorators
## Property Decorators
## Parameter Decorators
## Metadata
Example
https://github.com/tsedio/tsed/tree/production/packages/di/src/common/decorators

https://github.com/borjapazr/express-typescript-skeleton