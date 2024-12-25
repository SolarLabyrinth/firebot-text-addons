import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import {
  containsBadWord,
  containsNonASCIICharacters,
  getAtNamesFromDatabase,
  replaceUsernames,
} from "./message-parser";

type ScriptParams = {
  replace: string;
};

const script: Firebot.CustomScript<ScriptParams> = {
  getScriptManifest() {
    return {
      name: "SolarLabyrinth's Text Parsers",
      description:
        "Message Parsing Scripts for handling profanity and tts name replacement.",
      author: "SolarLabyrinth",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters() {
    return {
      replace: {
        title: "Replacement Text (CSV)",
        options: [],
        default: "",
        type: "string",
        useTextArea: true,
        description:
          "A Comma Separated Value spreadsheet of words and their desired replacements. Column 1 is the word to replace, Column 2 is the replacement. 1 row per word.",
      },
    };
  },
  parametersUpdated() {},
  run(runRequest) {
    runRequest.modules.replaceVariableManager.registerReplaceVariable({
      definition: {
        handle: "solarHasBadWord",
        description: `Returns true if the message contains a bad word according to the bad-words npm package. false if otherwise.`,
        usage: "solarHasBadWord[text]",
        possibleDataOutput: ["bool"],
        categories: ["advanced", "text"],
      },
      evaluator(_, message: string) {
        return containsBadWord(message);
      },
    });

    runRequest.modules.replaceVariableManager.registerReplaceVariable({
      definition: {
        handle: "solarHasNonAscii",
        description: `Returns true if the message contains non ascii text. false if otherwise.`,
        usage: "solarHasNonAscii[text]",
        possibleDataOutput: ["bool"],
        categories: ["advanced", "text"],
      },
      evaluator(_, message: string) {
        return containsNonASCIICharacters(message);
      },
    });

    runRequest.modules.replaceVariableManager.registerReplaceVariable({
      definition: {
        handle: "solarReplaceNames",
        description:
          "Cleans the text by replacing @mentions and known usernames with the value in the given metadata-key for that user.",
        usage: "solarReplaceNames[text, metadata-key]",
        possibleDataOutput: ["text"],
        categories: ["advanced", "text"],
      },
      async evaluator(_, message: string, metadataKey: string) {
        return replaceUsernames(
          message,
          await getAtNamesFromDatabase(runRequest, metadataKey)
        );
      },
    });
  },
};

export default script;
