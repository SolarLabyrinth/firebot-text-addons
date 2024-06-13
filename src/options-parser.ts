import { UserDb } from "@crowbartools/firebot-custom-scripts-types/types/modules/user-db";
import * as z from "zod";
import {
  CleanTTSMessageEffectGUIParams,
  CleanTTSMessageOptions,
} from "./types";

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
