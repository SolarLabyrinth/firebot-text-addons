import { ScriptRunRequest } from "../firebot/types";
import { registerReplaceVariable } from "../firebot/replace-variables";

export function hasNonAscii(message: string) {
  return /[^ -~]/.test(message);
}

export function registerHasNonAscii(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarHasNonAscii",
      description: `Returns true if the message contains non ascii text. false if otherwise.`,
      usage: "solarHasNonAscii[text]",
      possibleDataOutput: ["bool"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return hasNonAscii(message);
    },
  });
}
