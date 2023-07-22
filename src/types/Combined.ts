import { DeepPartial } from "./DeepPartial";

export type Combined<
  Target extends object = object,
  Others extends object = Target
> = Others extends DeepPartial<Target> ? Target : Target & DeepPartial<Others>;
