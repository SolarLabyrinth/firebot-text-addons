import { getUsersWithTTSNames } from "../firebot/database";
import { registerReplaceVariable } from "../firebot/replace-variables";
import { ScriptRunRequest } from "../firebot/types";
import Papa from "papaparse";

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

function parseCSV(text: string) {
  try {
    const values = Papa.parse(text, {
      delimiter: ",",
    });
    const data = values.data as string[][];
    const pairs = data
      .map((row) => row.map((cell) => cell.trim()))
      .map(([a, b]) => [a, b] as const);
    return new Map<string, string>(pairs);
  } catch {
    return new Map<string, string>();
  }
}

export function replaceWords(
  message: string,
  replacements: Map<string, string>
): string {
  let result = message;
  for (const [key, value] of replacements) {
    result = result.replace(new RegExp(`\\b${key}\\b`, "gi"), value);
  }
  return result;
}

export function registerReplaceNames(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarReplaceNames",
      description:
        "Cleans the text by replacing @mentions and known usernames with the value in the given metadata-key for that user.",
      usage: "solarReplaceNames[text, metadata-key]",
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    async evaluator(_, message: string, metadataKey: string) {
      const wordReplacements = parseCSV(runRequest.parameters.replacementCSV);
      const usernameReplacements = await getUsersWithTTSNames(
        runRequest,
        metadataKey
      );
      return replaceUsernames(
        replaceWords(message, wordReplacements),
        usernameReplacements
      );
    },
  });
}
