import { DeepPartial, NonEmptyArray } from "../../types";

export declare function combine<
  Target extends object = object,
  O extends Target = Target
>(original: Target, ...objects: NonEmptyArray<DeepPartial<Target>>): Target;
