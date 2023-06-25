import { DeepPartial, NonEmptyArray } from "../../types";

export function combineTo<Target extends object, O extends Target = Target>(
  original: Target,
  ...objects: NonEmptyArray<DeepPartial<Target>>
): Target {
  return objects.reduce((acc, obj) => {
    return combineRecursive(acc, obj);
  }, original);
}

export function combine(
  original: object,
  ...objects: NonEmptyArray<object>
): object {
  return objects.reduce((acc, obj) => {
    return combineRecursive(acc, obj);
  }, original);
}

function combineRecursive<Target extends object>(
  original: Target,
  toBeCombined: DeepPartial<Target>
): Target {
  // creates a copy of the original object
  // so that we can overwrite the values without mutating it
  const result: Target = { ...original };

  const keys = Object.keys(toBeCombined).map((k: string) => k as keyof Target);

  // iterates only over the keys in toBeCombined
  keys.forEach((key) => {
    const newValue = toBeCombined[
      key as keyof DeepPartial<Target>
    ] as DeepPartial<Target[typeof key]>;

    const originalValue = original[key];

    if (originalValue === undefined || originalValue === null) {
      result[key] = newValue as typeof originalValue;
      return;
    }

    // if the value is an object, we combine it recursively
    // otherwise we overwrite it (excluding arrays)
    if (
      newValue === null ||
      typeof newValue !== "object" ||
      Array.isArray(newValue)
    ) {
      Object.assign(result, { [key]: newValue });
    } else {
      Object.assign(result, {
        [key]: combineRecursive(
          originalValue,
          newValue as DeepPartial<typeof originalValue>
        ),
      });
    }
  });

  return result;
}
