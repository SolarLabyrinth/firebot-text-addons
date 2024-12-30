import { remove, obfuscate } from "confusables";
import { ScriptRunRequest } from "../firebot/types";
import { registerReplaceVariable } from "../firebot/replace-variables";

export function hasConfusables(text: string) {
  return text === remove(text);
}
export function cleanConfusables(text: string) {
  return remove(text);
}
export function toConfusables(text: string) {
  return obfuscate(text);
}

export function registerHasConfusables(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarHasConfusable",
      description: `Returns true if the message contains a confusable character. false if otherwise.`,
      usage: "solarHasConfusable[text]",
      possibleDataOutput: ["bool"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return hasConfusables(message);
    },
  });
}
export function registerCleanConfusables(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarCleanConfusables",
      description: `Returns the message with any confusable text transformed into ascii.`,
      usage: "solarCleanConfusables[text]",
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return cleanConfusables(message);
    },
  });
}
export function registerToConfusables(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarToConfusables",
      description: `Returns the confusables obfuscated message.`,
      usage: "solarToConfusables[text]",
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return toConfusables(message);
    },
  });
}
