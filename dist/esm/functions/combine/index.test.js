import { combine } from "./index";

describe("combine", () => {
  it("should return equal object when combining the same", () => {
    const sameObject = { a: 1, b: 2 };
    const result = combine(sameObject, sameObject);
    expect(result).toEqual(sameObject);
  });
  it("should return combined object", () => {
    const original = { a: 1, b: 2 };
    const toCombine = { b: 3, c: 4 };
    const result = combine(original, toCombine);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });
  it("should return combined object when multiple", () => {
    const original = { a: 1 };
    const firstToBeCombined = { b: 3, c: 3 };
    const secondToBeCombined = { b: 2, d: 4 };
    const result = combine(original, firstToBeCombined, secondToBeCombined);
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
  it("should return original when other object is empty", () => {
    const original = { a: 1 };
    const result = combine(original, {});
    expect(result).toEqual(original);
  });
  it("should return new object when original is empty", () => {
    const toBeCombined = { a: 1 };
    const result = combine({}, toBeCombined);
    expect(result).toEqual(toBeCombined);
  });
  it("should not alter the original object", () => {
    const original = { a: 1 };
    const toBeCombined = { a: 2 };
    const result = combine(original, toBeCombined);
    expect(original).toEqual({ a: 1 });
    expect(result).toEqual({ a: 2 });
  });
  describe("per property", () => {
    it("should overwrite when original value is null", () => {
      const original = { a: null };
      const toBeCombined = { a: 2 };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: 2 });
    });
    it("should overwrite when new value is null", () => {
      const original = { a: 1 };
      const toBeCombined = { a: null };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: null });
    });
    it("should overwrite when original value is undefined", () => {
      const original = { a: undefined };
      const toBeCombined = { a: 2 };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: 2 });
    });
    it("should overwrite when new value is explicitly undefined", () => {
      const original = { a: 2 };
      const toBeCombined = { a: undefined };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: undefined });
    });
    it.each([1, "1", true])("should overwrite primitive values", (value) => {
      const original = { a: 1 };
      const toBeCombined = { a: value };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: value });
    });
    it("should overwrite array", () => {
      const original = { a: [] };
      const toBeCombined = { a: [1] };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: [1] });
    });
    it("should overwrite array when new value is empty", () => {
      const original = { a: [1, 2, 3] };
      const toBeCombined = { a: [] };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({ a: [] });
    });
    it("should combine nested objects", () => {
      const original = { a: 1, b: { c: "hello", d: { e: true } } };
      const toBeCombined = { b: { c: "world", d: { e: false, f: "new" } } };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({
        a: 1,
        b: { c: "world", d: { e: false, f: "new" } },
      });
    });
    it("should keep the original object when the new is empty", () => {
      const original = { a: 1, b: { c: "hello", d: { e: true } } };
      const toBeCombined = { b: { c: "world", d: {} } };
      const result = combine(original, toBeCombined);
      expect(result).toEqual({
        a: 1,
        b: { c: "world", d: { e: true } },
      });
    });
  });
});
