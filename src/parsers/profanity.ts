import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

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
