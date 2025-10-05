# TypeScript

- Use typescript modules `.mts` or `.tsx` for react
- Use top-level `await` in scripts
- **No dependencies** code it all yourself unelss EXPLICITLY allowed in the prompt
- Use Classes not closures. DID YOU HEAR ME? Classes not closures.

## Types

- Do not use `any` type
- You may *accept* `unknown` types, but use sparingly.
- Do not use `as` to cast types.

## Errors

There are two types of errors to consider:

1. **Programmer errors** are incorrect programs, such as calling a function with incorrect arguments.
  For example, `Math.log(0)` or `parseInt('foo')`.
  Programmer errors represent an undefined state of the program, and cannot be recovered from.
  Programmer errors *MUST* crash the process immediately, as close to the offending stack as possible.

2. **Operational errors** represent branching conditions in a correct program, such as attempting to read a missing file.
  In Js/TS many operational errors are disguised as returning null or undefined.
  Operational errors *can* be handled, however not handling them becomes a programmer error.

Rules:

- For Operations that return null/undefined on error, use an assert/check to crash on error, until you've determined you *need* to handle the error at that point.
- Avoid throwing for operational errors. Use a `Result<T,E>` or `Option<T>` type to return from opertions.
- Immediately throw on bad arguments.
- *MUST NOT* catch downstream programming errors.
- If you encounter a programmer error, but no error is throw, then throw immediately.
- For new features, *SHOULD NOT* handle operational errors. Instead elect to crash. The boundaries on which to handle an error often take several iterations, and prematurely handling an error at the wrong level is an antipattern.
- No need to create subclassed errors. Just throw `Error` or use an assert.

## Classes

- Use classes, often in their own file. e.g. `MyClass.mts`.
- Prefer immutable classes, upheld with `public readonly` not `private`.
- Avoid interitance.
- Use *TitleCase* for Classes and public methods. e.g.
  ```ts
  class MyClass {
    SayHello() {...}
  }
  ```
- Use *camelCase* for properies, and assign them in the constructor:
  ```ts
  class MyClass {
    constructor(
      public readonly myName: string,
      public readonly myAge: number,
    ){}
  }
  ```
  No default values in the constructor.
- Use *Static Methods* as factories for unique arguments:
  ```ts
  class MyClass {
    constructor(
      public readonly myName: string,
      public readonly myAge: number,
    ){}
    public static CreateRandom() {
      return new MyClass(randomName(), randomAge())
    }
    public static CreateFromString(str: `${string}:${number}`) {
      let [name_s, age_s] = str.split(':')
      return new MyClass(name_s, TO_NUMBER(age_s, `Age Must be a Number`))
    }
  }
  ```
- Prefer instantiating from static methods
  - don't call constructor directly unless class is trivial
- For complex sets of arguments, you *MAY* use a one-off constructor object in a static method e.g.
  ```ts
  class MyClass {
    constructor(
      public readonly myName: string,
      public readonly myAge: number,
      ...
    ){}
    public static New(opts: {age: number, name: string, ...}) {
      return new MyClass(...)
    }
  }
  ```
- Static constructors MAY provide default arguments e.g.
  ```ts
  class MyClass {
    constructor(
      public readonly myName: string,
      public readonly myAge: number,
      ...
    ){}
    public static New(name: string, age = 20) {
      return new MyClass(...)
    }
  }
  ```

  Defautls with option objects:
  ```ts
  class MyClass {
    constructor(
      public readonly myName: string,
      public readonly myAge: number,
      ...
    ){}
    public static New({age = 20, name}: {age?: number, name: string, ...}) {
      return new MyClass(...)
    }
  }
  ```
- Class order:
  - properties (unless assigned in constructor)
  - constructor
  - static methods
  - methods
- Throw immediately on *BAD* arguments. e.g.
  ```ts
  class MyClass {
    constructor(
      public readonly myName: string,
      public readonly myAge: number,
    ){
      CHECK(myAge > 0, 'Age must be positive')
    }
  }
  ```

## Helper Functions

- *MUST* be pure
- *MUST* have constant arguments and constant outputs
- *MUST* write helpers in ALL_CAPS
- *MUST NOT* mutate their arguments
- *MAY* throw/assert on bad inputs

## Helper Classes

- Do *not* collect a bunch of independent static methods in a helper class
- Static methods:
  - *must* construct the class, or use a singleton
  - *may* return the instance
  - *may* call a specific method and return the result
  - *may* call other static methods
- Methods *may* mutate their arguments
- It is acceptable to create, use, destroy a helper in one use

Implement the helper as a class instead when:

1. there are many arguments
2. there are default arguments
3. the behavior is changed *non-locally* (e.g. log level)

## Discriminated Unions

Prefere discriminated unions over enums, subclassing, etc. e.g.

```ts
class A {
  type = 'A' as const
  constructor(
    public readonly x: X,
    public readonly y: Y,
  ){}
}

class B {
  type = 'B' as const
  constructor(
    public readonly x: X2,
    public readonly z: Z,
  ){}
}

type AA = | A | B

// example with faux pattern matching
const aa: AA = ...
switch(aa.type) {
  case 'A': ...; break
  case 'B': ...; break
  default:
    NEVER(aa) // ts error if there is an unhandled case
}
```

Prefer for ASTs, Parsers, etc.

## Coding Style

- Start with "mega methods". Writing initial methods that are hundreds of lines long is *OKAY* and preferred.
- **Avoid circular imports.** The import graph should be as close to asyclic as possible.
- When refactoring a large file, ONLY extract code that is independent. i.e. the extracted code *MUST NOT* import the larger initial file.
- Only Refactor existing code when:
  - unit testing
  - implementing a new feature
  - complex logic can be deduplicated between modules

## Wrappers

A wrapper is a class/module that acts as a layer of indirection.

- *SHOULD* takes the wrapped object as a constructor property
- *SHOULD* change method calls to project coding conventions
- *SHOULD* assert on bad inputs
- *SHOULD* return a `Result` for operations
- *MAY* use static constructors
- *MAY* provide convenience methods e.g. `List#Last()`, `List#First()`

## React

- Use React and JSX (.tsx)
- Use functional components
- Use StrictMode
- Use `useEffect`, `useReducer`, `useState`, etc
- Use `createContext` to manage/pass state along wth *props* e.g.
- Only `useMemo` when directed for performance

### Fetch

- Use `fetch`
  - You *MUST NOT* `fetch` in a reducer.
  - You *SHOULD* `fetch` in input handlers e.g. `onClick`, and dispatch *after* the response is resolved.
  - You *MAY* `fetch` initial state in `useEffect`.
- Only dispatch to reducers:
  - UI updates, such as hide/show a spinner
  - Resolved async operations have pending mutations
- You *MAY* refactor `fetch`es inside UI handlers, into a Context later, to allow for testing. e.g.
  ```ts
  function MyComponent () {
    const [toggle, isDone] = useMyContext()
    return (<div>
      {isDone ? <Done/> : <Pending /> }<button onClick={toggle} />
    </div>)
  }
  ```

### Reducers

- Only reduce over direct UI changes, not user-events
- Todo List Example:
  - Dispatch `InsertItem(position, message, done)` *after* its saved to server
  - Do NOT Dispatch `Add(message, done)` as an *event* when the user clicks a button
- Rerunning all reducer events *must* be immediate and synchronous

## Tests

- Write unit tests using `node:test`
- Write end-to-end test using playwright
  - e2e tests only need to cover the happy path, unless specified
