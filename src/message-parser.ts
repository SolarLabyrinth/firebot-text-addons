import Filter from "bad-words";
import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";

export type CleanTTSMessageEffectGUIParams = {
  message: string;
  filterNonASCII: boolean;
  filterBadWords: boolean;
  replaceUsernames: boolean;
  ttsNameKey: string;
};
export type CleanTTSMessageOptions = {
  message: string;
  filterNonASCII: boolean;
  filterBadWords: boolean;
  replaceUsernames: boolean;
  atNames: Map<string, string>;
};
export type CleanTTSMessageResponse = {
  ttsParserMessageWasClean: boolean;
  ttsParserTrippedFilter: "ASCII" | "BAD_WORD" | "";
  ttsParserCleanedMessage: string;
};

async function getAtNamesFromDatabase(
  runRequest: RunRequest<any>,
  metadataKey: string
) {
  try {
    type TTSNameQueryResult = {
      username: string;
      displayName: string;
      metadata: Record<string, string>;
      _id: string;
    };
    let viewerDatabase = runRequest.modules.viewerDatabase as any;
    const results: TTSNameQueryResult[] = await viewerDatabase
      .getViewerDb()
      .findAsync({ [`metadata.${metadataKey}`]: { $exists: true } })
      .projection({ username: 1, displayName: 1, metadata: 1 });

    const map = new Map<string, string>();
    for (const result of results) {
      map.set(result.username.toLowerCase(), result.metadata[metadataKey]);
      map.set(
        "@" + result.username.toLowerCase(),
        result.metadata[metadataKey]
      );
    }
    return map;
  } catch (error) {
    return new Map<string, string>();
  }
}

export async function parseOptions(
  effect: CleanTTSMessageEffectGUIParams,
  runRequest: RunRequest<any>
) {
  const message = effect.message;
  const filterNonASCII = effect.filterNonASCII;
  const filterBadWords = effect.filterBadWords;
  const replaceUsernames = effect.replaceUsernames;
  const ttsNameKey = effect.ttsNameKey;

  const atNames = replaceUsernames
    ? await getAtNamesFromDatabase(runRequest, ttsNameKey)
    : new Map<string, string>();

  const options: CleanTTSMessageOptions = {
    message,
    filterNonASCII,
    filterBadWords,
    replaceUsernames,
    atNames,
  };
  return options;
}

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
      if (options.replaceUsernames) {
        return options.atNames.get(word.toLowerCase()) || word;
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
