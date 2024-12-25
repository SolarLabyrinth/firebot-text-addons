import Filter from "bad-words";
import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";

export async function getAtNamesFromDatabase(
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
    }
    return map;
  } catch (error) {
    return new Map<string, string>();
  }
}

export function containsNonASCIICharacters(message: string) {
  return /[^ -~]/.test(message);
}

const badWordFilter = new Filter({});
export function containsBadWord(message: string) {
  return badWordFilter.isProfane(message);
}

export function replaceUsernames(
  message: string,
  replacements: Map<string, string>
): string {
  let result = message;
  for (const [key, value] of replacements) {
    result = result
      .replace(
        // Handles @mentions with optional spaces
        // "hi @solarlabyrinth" becomes "hi solar"
        // "hi@solarlabyrinth" also becomes "hi solar"
        new RegExp(`([^\\s])?@${key}(?![a-zA-Z0-9])`, "gi"),
        (_, charBeforeMention) =>
          charBeforeMention ? charBeforeMention + " " + value : value
      )
      // Replaces only if the key is standalone
      // "hi solarlabyrinth" becomes "hi solar"
      // "hisolarlabyrinth" is unchanged
      // "solarlabyrinth2" is unchanged
      .replace(
        new RegExp(`(^|[^a-zA-Z0-9])${key}(?![a-zA-Z0-9])`, "gi"),
        `$1${value}`
      );
  }
  return result;
}
