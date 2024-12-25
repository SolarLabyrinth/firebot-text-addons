import {
  containsNonASCIICharacters,
  containsBadWord,
  replaceUsernames,
} from "../src/message-parser";

describe("containsNonASCIICharacters()", () => {
  it("allows all ascii characters", () => {
    const message = "Munich";
    expect(containsNonASCIICharacters(message)).toBe(false);
  });
  it("blocks on non ascii characters", () => {
    const message = "München";
    expect(containsNonASCIICharacters(message)).toBe(true);
  });
});

describe("containsBadWord()", () => {
  it("allows all ascii characters", () => {
    const message = "hello";
    expect(containsBadWord(message)).toBe(false);
  });
  it("blocks on non ascii characters", () => {
    const message = "hello shit";
    expect(containsBadWord(message)).toBe(true);
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
