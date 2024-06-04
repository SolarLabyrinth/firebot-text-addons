import type { UserDb } from "@crowbartools/firebot-custom-scripts-types/types/modules/user-db";
import Filter from "bad-words";

export function containsNonASCIICharacters(message: string) {
  return /[^ -~]/.test(message);
}

const badWordFilter = new Filter({});
export function containsBadWord(message: string) {
  return badWordFilter.isProfane(message);
}

export function cleanMessageForTTS(message: string) {
  const atNames = getAtNamesFromMessage(message);
  return atNames;
}

export function getAtNamesFromMessage(message: string): Set<string> {
  const atNames = message
    .replace(/[^\w@]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((s) => /^@/.test(s));

  return new Set(atNames);
}

export async function getTTSName(
  userDb: UserDb,
  name: string
): Promise<string> {
  const value = await userDb.getUserMetadata(name, "tts-name");
  if (value && typeof value === "string") {
    return value;
  } else {
    return fallbackParseUserName(name);
  }
}

export function fallbackParseUserName(name: string): string {
  return name;
}

export async function getTTSNames(
  userDb: UserDb,
  names: Set<string>
): Promise<Map<string, string>> {
  const nameMap = new Map<string, string>();
  for (const name of names) {
    const ttsName = await getTTSName(userDb, name);
    nameMap.set(name, ttsName);
  }

  return nameMap;
}
