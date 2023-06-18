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
  todo: DeepPartial<Target>
): Target {
  const result: Target = { ...original };

  const keys = Object.keys(todo).map((k: string) => k as keyof Target);

  keys.forEach((key) => {
    const newValue = todo[key as keyof DeepPartial<Target>] as DeepPartial<
      Target[typeof key]
    >;

    const originalValue = original[key];

    if (originalValue === undefined || originalValue === null) {
      result[key] = newValue as typeof originalValue;
      return;
    }

    if (typeof newValue === "object" && newValue !== null) {
      Object.assign(result, {
        [key]: combineRecursive(
          originalValue,
          newValue as DeepPartial<typeof originalValue>
        ),
      });
    } else {
      Object.assign(result, { [key]: newValue });
    }
  });

  return result;
}
