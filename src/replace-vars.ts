import { getPronounForCase } from "./apis/pronouns";
import { getUsersWithTTSNames } from "./firebot/database";
import { registerReplaceVariable, ScriptRunRequest } from "./firebot/utils";
import { hasNonAscii } from "./parsers/ascii";
import {
  cleanConfusables,
  hasConfusables,
  toConfusables,
} from "./parsers/confusables";
import { hasProfanity } from "./parsers/profanity";
import {
  parseCSV,
  replaceUsernames,
  replaceWords,
} from "./parsers/word-replacement";

export function registerHasNonAscii(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "hasNonAscii",
      description: `Returns true if the message contains non ascii text. false if otherwise.`,
      usage: "hasNonAscii[text]",
      possibleDataOutput: ["bool"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return hasNonAscii(message);
    },
  });
}

export function registerHasConfusables(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "hasConfusable",
      description: `Returns true if the message contains a confusable character. false if otherwise.`,
      usage: "hasConfusable[text]",
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
      handle: "cleanConfusables",
      description: `Returns the message with any confusable text transformed into ascii.`,
      usage: "cleanConfusables[text]",
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
      handle: "toConfusables",
      description: `Returns the confusables obfuscated message.`,
      usage: "toConfusables[text]",
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return toConfusables(message);
    },
  });
}

export function registerHasProfanity(runRequest: ScriptRunRequest) {
  return registerReplaceVariable(runRequest, {
    definition: {
      handle: "hasProfanity",
      description: `Returns true if the message contains profanity according to the obscenity npm package. false if otherwise.`,
      usage: "hasProfanity[text]",
      possibleDataOutput: ["bool"],
      categories: ["advanced", "text"],
    },
    evaluator(_, message: string) {
      return hasProfanity(message);
    },
  });
}

export function registerReplaceNames(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "replaceWords",
      description:
        "Cleans the text by replacing @mentions and known usernames with the value in the given metadata-key for that user.",
      usage: "replaceWords[text, metadata-key]",
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

export function registerPronoun(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "pronoun",
      description: `Replaces the provided pronoun with the corresponding pronoun for the user according to https://pronouns.alejo.io/. Defaults to the provided pronoun if the user has not set their pronouns.`,
      usage: "pronoun[they, username]",
      examples: [
        {
          usage: "pronoun[they, username]",
          description: `Returns he, she, they, etc.`,
        },
        {
          usage: "pronoun[They, username]",
          description: `Returns He, She, They, etc.`,
        },
        {
          usage: "pronoun[THEY, username]",
          description: `Returns HE, SHE, THEY, etc.`,
        },
        {
          usage: "pronoun[their, username]",
          description: `Returns his, her, their, etc.`,
        },
      ],
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, _case: string, username: string) {
      return getPronounForCase(username, _case);
    },
  });
}
