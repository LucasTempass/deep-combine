# deep-combine

---

A simple utility library for **deep combining objects**. It allows to combine objects and their **nested properties**.
Providing better **readability**, making your code **more concise** and ensuring **type-safety** as well.

```ts
/* ❌ Error-prone, not readable and verbose */

function updatePerson(newProps: Partial<Person>): Person {
  const defaultProps: Person = {
    name: "John Doe", age: 30,
    address: {city: "New York"},
  };

  return {
    ...defaultProps, ...newProps,
    address: {
      ...defaultProps.address,
      ...newProps.address,
    },
  };
}

/* ✅ With deep-combine */

function updatePerson(newProps: Partial<Person>): Person {
  const defaultProps: Person = {
    name: "John Doe", age: 30,
    address: {city: "New York"},
  };

  return combine(defaultProps, newProps);
}
```

### Get Started

Install with npm:

```shell
npm install deep-combine
```

Install with yarn:

```shell
yarn add deep-combine
```

---

### Usage

#### Import

When using ES6 modules:

```ts
import {combine} from 'deep-combine';
```

When using CommonJS modules:

```js
const deepCombine = require('deep-combine');
```

#### Example

With JavaScript:

```js
const original = {
  name: "name",
  address: {
    city: "city",
  },
};

const withZipCode = {
  name: "new name",
  address: {
    zipCode: "zipCode",
  }
};

const combined = combine(original, withZipCode);

// 🔁 Result:
// { name: 'new name', address: { city: 'city', zipCode: 'zipCode' } }
```

With TypeScript:

```ts
const original: Person = {
  name: "name",
  address: {
    city: "city",
  },
};

const withZipCode = {
  name: "new name",
  address: {
    zipCode: "zipCode",
  }
};

/* generics could be omitted and type would be inferred from original */
const combined: Person = combine<Person>(original, withZipCode);

// 🔁 Result:
// { name: 'new name', address: { city: 'city', zipCode: 'zipCode' } }
```

---

## How to achieve the best results with `deep-combine` and TypeScript

TypeScript still has some limitations when working with the `Partial<T>` utility type.
It allows to explicitly set properties to `undefined` even if they are not optional.

This leads to conflicting property types and not truly a partial representation of that type, for example:

```ts
interface Person {
  name: string;
  address: {
    street: string;
    number: number;
  };
}

/* ❌ "address" is not assignable to undefined but Partial<Person> allows it */
const person: Partial<Person> = {
  name: "John",
  address: undefined,
};

/* ✅ This is a strictly valid partial representation of Person */
const person: Partial<Person> = {
  name: "John",
};
```

To obtain the best results when using `deep-combine` with TypeScript, you can use the following compiler option:

In your `tsconfig.json` file:
```yaml
  "compilerOptions": {
    "exactOptionalPropertyTypes": true,
    // ... other compiler options
  }
```

To read more about this, see
the [TypeScript documentation](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes).

---

## About this package

This is **my first published npm package**, so please **feel free to open an issue** and contribute if you have any
**suggestions**. I apologize for any inconvenience and I hope you find this package useful.

The **original ideia came from a personal** need to combine objects in day-to-day development, more specifically when
**working with
tests**, where I needed to combine **objects with default values and test case specific properties**.

There are other packages with similar functionality, but I wanted to create a **simple and lightweight** package to
learn more about **publishing npm packages**. If this package does not suit your needs check them out or feel free to
contribute.