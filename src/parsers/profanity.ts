import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

import { registerReplaceVariable } from "../firebot/replace-variables";
import { ScriptRunRequest } from "../firebot/types";

let matcher = buildMatcher();

function buildMatcher(allowedWords = "") {
  const allowedWordsList = allowedWords
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  return new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
    whitelistedTerms: allowedWordsList,
  });
}

export function updateMatcher(allowedWords: string) {
  matcher = buildMatcher(allowedWords);
}

export function hasProfanity(message: string) {
  return matcher.hasMatch(message);
}

export function registerHasProfanity(runRequest: ScriptRunRequest) {
  return registerReplaceVariable(runRequest, {
    definition: {
      handle: "solarHasBadWord",
      description: `Returns true if the message contains profanity according to the obscenity npm package. false if otherwise.`,
      usage: "solarHasBadWord[text]",
      possibleDataOutput: ["bool"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return hasProfanity(message);
    },
  });
}
