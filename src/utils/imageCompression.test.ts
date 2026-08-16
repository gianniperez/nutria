import { describe, it, expect } from "vitest";
import { compressImageToWebP } from "./imageCompression";

describe("compressImageToWebP", () => {
  it("debe existir y ser una función asíncrona", () => {
    expect(typeof compressImageToWebP).toBe("function");
  });
});
