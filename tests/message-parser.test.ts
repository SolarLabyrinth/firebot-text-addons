import { describe, it, expect } from "vitest";

import { hasNonAscii } from "../src/parsers/ascii";
import { hasProfanity } from "../src/parsers/profanity";
import { replaceUsernames } from "../src/parsers/word-replacement";

describe("hasNonAscii()", () => {
  it("allows all ascii characters", () => {
    const message = "Munich";
    expect(hasNonAscii(message)).toBe(false);
  });
  it("blocks on non ascii characters", () => {
    const message = "München";
    expect(hasNonAscii(message)).toBe(true);
  });
});

describe("hasProfanity()", () => {
  it("allows non profane messages", () => {
    const message = "hello";
    expect(hasProfanity(message)).toBe(false);
  });
  it("blocks profane messages", () => {
    const message = "hello shit";
    expect(hasProfanity(message)).toBe(true);
  });
});

describe("replaceUsernames()", () => {
  it("replaces mentions and standalone names", () => {
    expect(
      replaceUsernames(
        "@solarlabyrinth says: hello to solarlabyrinth",
        new Map([["solarlabyrinth", "solar"]])
      )
    ).toBe("solar says: hello to solar");
  });
  it("replaces mentions with characters in front or back", () => {
    expect(
      replaceUsernames(
        "hi@solarlabyrinth!",
        new Map([["solarlabyrinth", "solar"]])
      )
    ).toBe("hi solar!");
  });
  it("does not replace mentions for subsets of larger words", () => {
    expect(
      replaceUsernames(
        "hi@solarlabyrinth123",
        new Map([["solarlabyrinth", "solar"]])
      )
    ).toBe("hi@solarlabyrinth123");
  });
});
