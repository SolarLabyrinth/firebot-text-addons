import Filter from "bad-words";
import isUrl from "is-url";
import { CleanTTSMessageOptions } from "./types";

function containsNonASCIICharacters(message: string) {
  return /[^ -~]/.test(message);
}

const badWordFilter = new Filter({});
function containsBadWord(message: string) {
  return badWordFilter.isProfane(message);
}

export function parseMessage(options: CleanTTSMessageOptions) {
  if (options.filterNonASCII && containsNonASCIICharacters(options.message)) {
    return {
      ttsParserMessageWasClean: false,
      ttsParserTrippedFilter: "ASCII",
      ttsParserCleanedMessage: "",
    };
  }
  if (options.filterBadWords && containsBadWord(options.message)) {
    return {
      ttsParserMessageWasClean: false,
      ttsParserTrippedFilter: "BAD_WORD",
      ttsParserCleanedMessage: "",
    };
  }

  const words = options.message
    .split(/\s+/)
    .map((word) => {
      if (options.stripUrls) {
        return isUrl(word) ? null : word;
      } else {
        return word;
      }
    })
    .map((word) => {
      if (options.stripEmotes) {
        return options.emotesList.has(word) ? null : word;
      } else {
        return word;
      }
    })
    .map((word) => {
      if (options.replaceUsernames) {
        return options.atNames.get(word) || word;
      } else {
        return word;
      }
    })
    .filter((word) => word !== null);

  return {
    ttsParserMessageWasClean: true,
    ttsParserTrippedFilter: "",
    ttsParserCleanedMessage: words.join(" "),
  };
}
