import { parseMessage } from "../src/message-parser";

function getOptions() {
  return {
    message: "",
    filterNonASCII: false,
    filterBadWords: false,
    replaceUsernames: false,
    emotesList: new Set<string>(),
    atNames: new Map<string, string>(),
  };
}

test("it allows all ascii characters", () => {
  const options = getOptions();
  options.message = "Munich";
  options.filterNonASCII = true;

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(true);
  expect(response.ttsParserTrippedFilter).toBe("");
  expect(response.ttsParserCleanedMessage).toBe("Munich");
});

test("it blocks on non ascii characters", () => {
  const options = getOptions();
  options.message = "München";
  options.filterNonASCII = true;

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(false);
  expect(response.ttsParserTrippedFilter).toBe("ASCII");
  expect(response.ttsParserCleanedMessage).toBe("");
});

test("it doesn't block allowed words", () => {
  const options = getOptions();
  options.message = "hello";
  options.filterBadWords = true;

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(true);
  expect(response.ttsParserTrippedFilter).toBe("");
  expect(response.ttsParserCleanedMessage).toBe("hello");
});

test("it blocks filtered words", () => {
  const options = getOptions();
  options.message = "hello shit";
  options.filterBadWords = true;

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(false);
  expect(response.ttsParserTrippedFilter).toBe("BAD_WORD");
  expect(response.ttsParserCleanedMessage).toBe("");
});

test("it replaces @names when on", () => {
  const options = getOptions();
  options.message = "@example says: hello to @example2";
  options.replaceUsernames = true;
  options.atNames = new Map([
    ["@example", "example"],
    ["@example2", "example2"],
  ]);

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(true);
  expect(response.ttsParserTrippedFilter).toBe("");
  expect(response.ttsParserCleanedMessage).toBe(
    "example says: hello to example2"
  );
});

test("it ignores @names when off", () => {
  const options = getOptions();
  options.message = "@example says: hello to @example2";
  options.replaceUsernames = false;
  options.atNames = new Map([
    ["@example", "example"],
    ["@example2", "example2"],
  ]);

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(true);
  expect(response.ttsParserTrippedFilter).toBe("");
  expect(response.ttsParserCleanedMessage).toBe(
    "@example says: hello to @example2"
  );
});
