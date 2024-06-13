import { UserDb } from "@crowbartools/firebot-custom-scripts-types/types/modules/user-db";
import { parseOptions } from "../src/options-parser";

test("it runs tests", () => {
  const mockDB: UserDb = {
    getUserMetadata: jest.fn(
      (username: string, key: string) =>
        ({
          user1: "user one",
          user2: undefined,
        }[username])
    ),
  } as any;

  const options = parseOptions(
    {
      emotesList: "emoteA, emoteB",
      filterBadWords: false,
      filterNonASCII: false,
      message: "test",
      replaceUsernames: false,
      stripEmotes: false,
      stripUrls: false,
      ttsNameKey: "test",
    },
    mockDB
  );
  expect(true).toBe(true);
});
