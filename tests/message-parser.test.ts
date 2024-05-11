import { getAtNamesFromMessage } from "../src/message-parser";

test("@names get parsed into a set", () => {
  const message =
    "!@exampleUser1.        says     hello to  @exampleUser2. how is @exampleUser2?   ";

  const actual = getAtNamesFromMessage(message);
  const expected = new Set(["@exampleUser1", "@exampleUser2"]);

  expect(actual).toEqual(expected);
});
