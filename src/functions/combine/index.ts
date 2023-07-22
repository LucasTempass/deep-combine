import {Combined, DeepPartial, NonEmptyArray} from "../../types";

// defaults to "object" if no type is provided
// making it possible to use "combine" without generics
// unless explicitly provided, the type for the target
export function combine<
  Target extends object = object,
  Others extends object = Target
>(
  original: Target,
  ...objects: NonEmptyArray<DeepPartial<Others>>
): Combined<Target, Others> {
  return objects.reduce((acc, obj) => {
    return combineRecursive(acc, obj);
  }, original as Combined<Target, Others>);
}

// helper function to combine objects recursively
function combineRecursive<
  Target extends object,
  Others extends object = Target
>(
  original: Target,
  toBeCombined: DeepPartial<Others>
): Combined<Target, Others> {
  // the return type is the combination of the two types
  // creates a copy of the original object
  // so that we can overwrite the values without mutating it
  const result: Combined<Target, Others> = { ...original } as Combined<
    Target,
    Others
  >;

  const keys = Object.keys(toBeCombined).map(
    (k: string) => k as keyof DeepPartial<Others>
  );

  // iterates only over the keys in toBeCombined
  keys.forEach((key: keyof DeepPartial<Others>) => {
    const newValue = toBeCombined[key];

    // if the original contains the key, we get the value from it
    const originalValue =
      key in original ? original[key as unknown as keyof Target] : undefined;

    // if the original value is undefined, we just assign the new value
    if (originalValue === undefined || originalValue === null) {
      Object.assign(result, { [key]: newValue });
      return;
    }

    // if the value is an object, we combine it recursively (excluding arrays)
    // otherwise we overwrite it
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
