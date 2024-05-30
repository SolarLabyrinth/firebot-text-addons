import {
  cleanMessageForTTS,
  containsBadWord,
  containsNonASCIICharacters,
  getAtNamesFromMessage,
} from "../src/message-parser";

test.each([
  ["Munich", false],
  ["München", true],
])("containsNonASCIICharacters(%s)", (input, expected) => {
  const actual = containsNonASCIICharacters(input);
  expect(actual).toEqual(expected);
});

test.each([
  ["hello shit", true],
  ["hello", false],
])("containsBadWord(%s)", (input, expected) => {
  const actual = containsBadWord(input);
  expect(actual).toEqual(expected);
});

test("@names get parsed into a set", () => {
  const message =
    "!@example_User1.        says     hello to  @exampleUser_2. how is @exampleUser2?   ";

  const actual = cleanMessageForTTS(message);
  const expected = new Set([
    "@example_User1",
    "@exampleUser_2",
    "@exampleUser2",
  ]);

  expect(actual).toEqual(expected);
});

test("@names get parsed into a set", () => {
  const message =
    "!@exampleUser1.        says     hello to  @exampleUser2. how is @exampleUser2?   ";

  const actual = getAtNamesFromMessage(message);
  const expected = new Set(["@exampleUser1", "@exampleUser2"]);

  expect(actual).toEqual(expected);
});
