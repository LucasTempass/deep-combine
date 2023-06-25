import { combineTo } from "./index";

describe("combineTo", () => {
  it("should return equal object when combining the same", () => {
    const sameObject = { a: 1, b: 2 };

    const result = combineTo<typeof sameObject>(sameObject, sameObject);

    expect(result).toEqual(sameObject);
  });

  it("should return combined object", () => {
    type Target = { a: number; b: number; c?: number };

    const original: Target = { a: 1, b: 2 };
    // will overwrite "b" and add "c" but not update "a"
    const toCombine = { b: 3, c: 4 };

    const result = combineTo<Target>(original, toCombine);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("should return combined object when multiple", () => {
    type Target = { a: number; b?: number; c?: number; d?: number };

    const original: Target = { a: 1 };
    const firstToBeCombined = { b: 3, c: 3 };
    // will overwrite "b" and add "d" but not update "c"
    const secondToBeCombined = { b: 2, d: 4 };

    const result = combineTo<Target>(
      original,
      firstToBeCombined,
      secondToBeCombined
    );

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("should return original when other object is empty", () => {
    const original = { a: 1 };

    const result = combineTo<typeof original>(original, {});

    expect(result).toEqual(original);
  });

  it("should return new object when original is empty", () => {
    type Target = { a?: number };

    const toBeCombined: Target = { a: 1 };

    // original is empty because all properties are optional
    const result = combineTo<Target>({}, toBeCombined);

    expect(result).toEqual(toBeCombined);
  });

  describe("per property", () => {
    it("should overwrite when original value is null", () => {
      type Target = {
        a: number | null;
      };

      const original = { a: null };
      const toBeCombined = { a: 2 };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({ a: 2 });
    });

    it("should overwrite when new value is null", () => {
      type Target = {
        a: number | null;
      };

      const original = { a: 1 };
      const toBeCombined = { a: null };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({ a: null });
    });

    it("should overwrite when original value is undefined", () => {
      type Target = {
        a: number | undefined;
      };

      const original = { a: undefined };
      const toBeCombined = { a: 2 };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({ a: 2 });
    });

    it("should overwrite when new value is explicitly undefined", () => {
      type Target = {
        a: number | undefined;
      };

      const original = { a: 2 };
      const toBeCombined = { a: undefined };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({ a: undefined });
    });

    it.each([1, "1", true])(
      "should overwrite primitive values",
      (value: string | number | boolean) => {
        type Target = {
          a: string | number | boolean;
        };

        const original = { a: 1 };
        const toBeCombined = { a: value };

        const result = combineTo<Target>(original, toBeCombined);

        expect(result).toEqual({ a: value });
      }
    );

    it("should overwrite array", () => {
      type Target = {
        a: number[];
      };

      const original = { a: [] };
      const toBeCombined = { a: [1] };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({ a: [1] });
    });

    it("should overwrite array when new value is empty", () => {
      type Target = {
        a: number[];
      };

      const original = { a: [1, 2, 3] };
      const toBeCombined = { a: [] };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({ a: [] });
    });

    it("should combine nested objects", () => {
      type Target = {
        a: number;
        b: {
          c: string;
          d: {
            e: boolean;
            f?: string;
          };
        };
      };

      const original: Target = { a: 1, b: { c: "hello", d: { e: true } } };
      const toBeCombined = { b: { c: "world", d: { e: false, f: "new" } } };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({
        a: 1,
        b: { c: "world", d: { e: false, f: "new" } },
      });
    });

    it("should keep the original object when the new is empty", () => {
      type Target = {
        a: number;
        b: {
          c: string;
          d: {
            e: boolean;
            f?: string;
          };
        };
      };

      const original: Target = { a: 1, b: { c: "hello", d: { e: true } } };
      const toBeCombined = { b: { c: "world", d: {} } };

      const result = combineTo<Target>(original, toBeCombined);

      expect(result).toEqual({
        a: 1,
        b: { c: "world", d: { e: true } },
      });
    });
  });
});
