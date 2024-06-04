import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { containsNonASCIICharacters } from "./message-parser";

interface CleanTTSMessageEffectParams {
  message: string;
  stripNonASCII: boolean;
  stripUrls: boolean;
  stripBadWords: boolean;
  replaceUsernames: boolean;
  ttsNameKey: string;
  stripEmotes: boolean;
  emotesList: string;
}

const cleanTTSMessageEffect: Effects.EffectType<CleanTTSMessageEffectParams> = {
  definition: {
    id: "solar:clean-tts-message",
    name: "Clean TTS Message",
    description: "Cleans a chat message for use in TTS",
    icon: "",
    categories: [],
    dependencies: [],
    outputs: [
      {
        label: "Clean Message",
        defaultName: "cleanMessage",
        description:
          "The result of the JavaScript code. Note you must use 'return' for a result to be captured.",
      },
    ],
  } as any,
  optionsTemplate: `
    <eos-container>
      <firebot-input 
          model="effect.message" 
          use-text-area="true"
          placeholder-text="Enter message"
      />
    </eos-container>
    <eos-container pad-top="true">
      <firebot-checkbox 
          label="Strip Non ASCII Characters"
          model="effect.stripNonASCII"
      />
      <firebot-checkbox 
          label="Strip URLs"
          model="effect.stripUrls"
      />
      <firebot-checkbox 
          label="Strip Bad Words (via npm bad-words)"
          model="effect.stripBadWords"
      />
      <firebot-checkbox 
          label="Replace @Usernames with custom metadata names"
          model="effect.replaceUsernames"
      />
    </eos-container>
    <eos-container ng-if="effect.replaceUsernames">
      <firebot-input
          model="effect.ttsNameKey"
          placeholder-text="TTS Name Metadata Key"
      />
    </eos-container>
    <eos-container ng-if="effect.replaceUsernames" pad-top="true"></eos-container>
    <eos-container>
      <firebot-checkbox
          label="Strip Emotes"
          model="effect.stripEmotes"
      />
    </eos-container>
    <eos-container ng-if="effect.stripEmotes">
      <firebot-input
          model="effect.emotesList" 
          placeholder-text="Enter emotes list"
      />
    </eos-container>
  `,
  optionsController: ($scope) => {
    if ($scope.effect.message == null) {
      $scope.effect.message = "";
    }
    if ($scope.effect.stripNonASCII == null) {
      $scope.effect.stripNonASCII = true;
    }
    if ($scope.effect.stripUrls == null) {
      $scope.effect.stripUrls = true;
    }
    if ($scope.effect.stripBadWords == null) {
      $scope.effect.stripBadWords = true;
    }
    if ($scope.effect.replaceUsernames == null) {
      $scope.effect.replaceUsernames = true;
    }
    if ($scope.effect.ttsNameKey == null) {
      $scope.effect.ttsNameKey = "";
    }
    if ($scope.effect.stripEmotes == null) {
      $scope.effect.stripEmotes = true;
    }
    if ($scope.effect.emotesList == null) {
      $scope.effect.emotesList = "";
    }
  },
  async onTriggerEvent(event) {
    const { effect } = event;

    const message = effect.message;
    const stripNonASCII = effect.stripNonASCII;
    const stripBadWords = effect.stripBadWords;
    const replaceUsernames = effect.replaceUsernames;

    let cleanMessage = message;
    if (stripNonASCII && containsNonASCIICharacters(cleanMessage)) {
      cleanMessage = "";
    }

    return {
      success: true,
      outputs: {
        cleanMessage: cleanMessage,
      },
    };
  },
};

interface Params {
  message: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Solar's TTS Message Parser",
      description: "A TTS Message Parsing Script",
      author: "SolarLabyrinth",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "Hello World!",
        description: "Message",
        secondaryDescription: "Enter a message here",
      },
    };
  },
  run: async (runRequest) => {
    runRequest.modules.effectManager.registerEffect(cleanTTSMessageEffect);
  },
};

export default script;
