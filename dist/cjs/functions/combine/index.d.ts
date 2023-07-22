import { Combined, DeepPartial, NonEmptyArray } from "../../types";
export declare function combine<Target extends object = object, Others extends object = Target>(original: Target, ...objects: NonEmptyArray<DeepPartial<Others>>): Combined<Target, Others>;
