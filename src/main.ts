import { Script, ScriptRunRequest } from "./firebot/utils";
import { updateMatcher } from "./parsers/profanity";
import {
  registerCleanConfusables,
  registerHasConfusables,
  registerHasNonAscii,
  registerHasProfanity,
  registerPronoun,
  registerReplaceNames,
  registerToConfusables,
} from "./replace-vars";

let savedRunRequest: ScriptRunRequest | undefined;

const script: Script = {
  getScriptManifest() {
    return {
      name: "Text Addons",
      description:
        "Assorted text parsing scripts for things like profanity, confusables, and tts word replacement.",
      version: "2.3.0",
      author: "SolarLabyrinth",
      firebotVersion: "5",
    };
  },
  getDefaultParameters() {
    return {
      replacementCSV: {
        title: "Replacement Text (CSV)",
        options: [],
        default: "",
        type: "string",
        useTextArea: true,
        description:
          "A Comma Separated Value spreadsheet of words and their desired replacements. Column 1 is the word to replace, Column 2 is the replacement. 1 row per word.",
      },
      allowedWords: {
        title: "Allowed Words",
        options: [],
        default: "",
        type: "string",
        description:
          "A Comma Separated List of words to be allowed by the profanity filter.",
      },
    };
  },
  parametersUpdated(parameters) {
    if (savedRunRequest) {
      savedRunRequest.parameters = parameters;
    }
    updateMatcher(parameters.allowedWords);
  },
  run(runRequest) {
    savedRunRequest = runRequest;
    updateMatcher(runRequest.parameters.allowedWords);

    registerHasNonAscii(runRequest);

    registerHasConfusables(runRequest);
    registerCleanConfusables(runRequest);
    registerToConfusables(runRequest);

    registerHasProfanity(runRequest);

    registerReplaceNames(runRequest);

    registerPronoun(runRequest);
  },
};

export default script;
