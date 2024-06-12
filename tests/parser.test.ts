import { parseMessage } from "../src/parser";

function getOptions() {
  return {
    message: "",
    filterNonASCII: false,
    stripUrls: false,
    filterBadWords: false,
    replaceUsernames: false,
    stripEmotes: false,
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
test("it strips urls", () => {
  const options = getOptions();
  options.message = "check out https://www.example.com/";
  options.stripUrls = true;

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(true);
  expect(response.ttsParserTrippedFilter).toBe("");
  expect(response.ttsParserCleanedMessage).toBe("check out");
});

test("it doesn't strip non urls", () => {
  const options = getOptions();
  options.message = "check out the example site";
  options.stripUrls = true;

  const response = parseMessage(options);

  expect(response.ttsParserMessageWasClean).toBe(true);
  expect(response.ttsParserTrippedFilter).toBe("");
  expect(response.ttsParserCleanedMessage).toBe("check out the example site");
});
