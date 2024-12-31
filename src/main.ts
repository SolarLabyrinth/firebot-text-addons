import { registerHasNonAscii } from "./parsers/ascii";
import {
  registerCleanConfusables,
  registerHasConfusables,
  registerToConfusables,
} from "./parsers/confusables";
// import { registerFromL33t } from "./parsers/l33t";
import { registerHasProfanity, updateMatcher } from "./parsers/profanity";
import { registerReplaceNames } from "./parsers/word-replacement";

import { Script, ScriptRunRequest } from "./firebot/types";
import { registerPronoun } from "./apis/pronouns";

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

    // TODO: Needs better word processing.
    // registerFromL33t(runRequest);
    // registerFromL33t(runRequest);

    registerHasProfanity(runRequest);

    registerReplaceNames(runRequest);

    registerPronoun(runRequest);
  },
};

export default script;
