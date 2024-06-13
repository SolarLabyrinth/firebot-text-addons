import { UserDb } from "@crowbartools/firebot-custom-scripts-types/types/modules/user-db";
import Filter from "bad-words";
import isUrl from "is-url";
import * as z from "zod";

export type CleanTTSMessageEffectGUIParams = {
  message: string;
  filterNonASCII: boolean;
  stripUrls: boolean;
  filterBadWords: boolean;
  replaceUsernames: boolean;
  ttsNameKey: string;
  stripEmotes: boolean;
  emotesList: string;
};
export type CleanTTSMessageOptions = {
  message: string;
  filterNonASCII: boolean;
  stripUrls: boolean;
  filterBadWords: boolean;
  replaceUsernames: boolean;
  stripEmotes: boolean;
  emotesList: Set<string>;
  atNames: Map<string, string>;
};
export type CleanTTSMessageResponse = {
  ttsParserMessageWasClean: boolean;
  ttsParserTrippedFilter: "ASCII" | "BAD_WORD" | "";
  ttsParserCleanedMessage: string;
};

function containsNonASCIICharacters(message: string) {
  return /[^ -~]/.test(message);
}

const badWordFilter = new Filter({});
function containsBadWord(message: string) {
  return badWordFilter.isProfane(message);
}

const strArray = z.array(z.string());
function parseEmoteSet(emoteList: string) {
  try {
    const array = strArray.parse(JSON.parse(emoteList));
    return new Set(array);
  } catch {
    return new Set<string>();
  }
}

async function getTTSName(
  userDb: UserDb,
  name: string,
  metadataKey: string
): Promise<string> {
  const stripedName = name.replace(/^@/, "");
  const value = await userDb.getUserMetadata(stripedName, metadataKey);
  if (value && typeof value === "string") {
    return value;
  } else {
    return stripedName; //TODO: Parse further
  }
}

export async function getTTSNames(
  userDb: UserDb,
  names: Set<string>,
  metadataKey: string
): Promise<Map<string, string>> {
  const nameMap = new Map<string, string>();
  for (const name of names) {
    const ttsName = await getTTSName(userDb, name, metadataKey);
    nameMap.set(name, ttsName);
  }

  return nameMap;
}

export async function getAtNamesFromMessage(
  userDb: UserDb,
  message: string,
  metadataKey: string
) {
  const atNamesSet = new Set(
    message
      .replace(/[^\w@]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .filter((s) => /^@/.test(s))
  );

  return await getTTSNames(userDb, atNamesSet, metadataKey);
}

export async function parseOptions(
  effect: CleanTTSMessageEffectGUIParams,
  userDB: UserDb
) {
  const message = effect.message;
  const filterNonASCII = effect.filterNonASCII;
  const stripUrls = effect.stripUrls;
  const filterBadWords = effect.filterBadWords;
  const replaceUsernames = effect.replaceUsernames;
  const ttsNameKey = effect.ttsNameKey;
  const stripEmotes = effect.stripEmotes;
  const emotesList = parseEmoteSet(effect.emotesList);

  const atNames = replaceUsernames
    ? await getAtNamesFromMessage(userDB, effect.message, ttsNameKey)
    : new Map<string, string>();

  const options: CleanTTSMessageOptions = {
    message,
    filterNonASCII,
    stripUrls,
    filterBadWords,
    replaceUsernames,
    stripEmotes,
    emotesList,
    atNames,
  };
  return options;
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
