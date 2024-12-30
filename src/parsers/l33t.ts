import { registerReplaceVariable } from "../firebot/replace-variables";
import { ScriptRunRequest } from "../firebot/types";

export function fromL33t(word: string) {
  return word
    .replaceAll(/[@4]/g, "a")
    .replaceAll(/[(]/g, "c")
    .replaceAll(/[3]/g, "e")
    .replaceAll(/[1|]/g, "i")
    .replaceAll(/[0]/g, "o")
    .replaceAll(/[$]/g, "s");
}
export function toL33t(word: string) {
  return word
    .replaceAll(/[a]/g, "@")
    .replaceAll(/[c]/g, "(")
    .replaceAll(/[e]/g, "3")
    .replaceAll(/[i|]/g, "1")
    .replaceAll(/[o]/g, "0")
    .replaceAll(/[s]/g, "$");
}

export function registerFromL33t(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarFromL33t",
      description: `Returns the l33t message transformed into ascii.`,
      usage: "solarFromL33t[text]",
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return fromL33t(message);
    },
  });
}
export function registerToL33t(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarToL33t",
      description: `Returns the message transformed into l33t-speak.`,
      usage: "solarToL33t[text]",
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return toL33t(message);
    },
  });
}
