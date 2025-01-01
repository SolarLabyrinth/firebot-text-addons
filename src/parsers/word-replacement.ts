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

export function parseCSV(text: string) {
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
