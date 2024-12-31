import { registerHasNonAscii } from "./parsers/ascii";
import {
  registerCleanConfusables,
  registerHasConfusables,
  registerToConfusables,
} from "./parsers/confusables";
// import { registerFromL33t } from "./parsers/l33t";
import { registerHasProfanity } from "./parsers/profanity";
import { registerReplaceNames } from "./parsers/word-replacement";

import { Script } from "./firebot/types";

let savedRunRequest;

const script: Script = {
  getScriptManifest() {
    return {
      name: "Text Addons",
      description:
        "Assorted text parsing scripts for things like profanity, confusables, and tts word replacement.",
      version: "2.1.0",
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
    };
  },
  parametersUpdated(parameters) {
    savedRunRequest.parameters = parameters;
  },
  run(runRequest) {
    savedRunRequest = runRequest;

    registerHasNonAscii(runRequest);

    registerHasConfusables(runRequest);
    registerCleanConfusables(runRequest);
    registerToConfusables(runRequest);

    // TODO: Needs better word processing.
    // registerFromL33t(runRequest);
    // registerFromL33t(runRequest);

    registerHasProfanity(runRequest);

    registerReplaceNames(runRequest);
  },
};

export default script;
