Test 
Wrapped function with typescript

```
function test() {
  console.log("test");
  throw new Error("Error test");
}
async function testAsync() {
  console.log("start");
  setTimeout(() => {
    console.log("start timount");
    console.log("finish async");
  }, 2000);
  console.log("end");
}
function wrap<T extends Function>(fn: T): T {
  return <any>function (...args: any[]) {
    try {
      return fn(...args);
    } catch (error) {
      console.log("Error");
    }
  };
}
const wrappedFoo = wrap(test);

type AsyncFn = (...args: any[]) => Promise<any>;

function wrappedExeption<T extends AsyncFn>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>) => {
    try {
      console.log("wrapper exception");
      return await fn(...args);
    } catch (exception) {
      console.log("Exception");
    }
  };
}

```