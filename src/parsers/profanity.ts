import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

import { registerReplaceVariable } from "../firebot/replace-variables";
import { ScriptRunRequest } from "../firebot/types";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export function hasProfanity(message: string) {
  return matcher.hasMatch(message);
}

export function registerHasProfanity(runRequest: ScriptRunRequest) {
  return registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarHasBadWord",
      description: `Returns true if the message contains a bad word according to the bad-words npm package. false if otherwise.`,
      usage: "solarHasBadWord[text]",
      possibleDataOutput: ["bool"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return hasProfanity(message);
    },
  });
}
