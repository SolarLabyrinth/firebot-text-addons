import {
  Firebot,
  RunRequest,
} from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import {
  CleanTTSMessageEffectGUIParams,
  parseMessage,
  parseOptions,
} from "./parser";

function makeEffect(
  runRequest: RunRequest<ScriptParams>
): Effects.EffectType<CleanTTSMessageEffectGUIParams> {
  return {
    definition: {
      id: "solar:clean-tts-message",
      name: "Clean TTS Message",
      description: "Cleans a chat message for use in TTS",
      icon: "",
      categories: [],
      dependencies: [],
      outputs: [
        {
          label: "Was Message Clean",
          defaultName: "ttsParserMessageWasClean",
          description:
            "True if the message did not fail any filter. False if it did fail any filter",
        },
        {
          label: "Tripped Filter",
          defaultName: "ttsParserTrippedFilter",
          description: `The name of the filter that was tripped, or empty string if the message was clean. ("ASCII","BAD_WORD", "")`,
        },
        {
          label: "Clean Message",
          defaultName: "ttsParserCleanedMessage",
          description:
            "The result of the tts message parsing. Either the original message, a modified message, or an empty string",
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
          label="Filter Non ASCII Characters"
          model="effect.filterNonASCII"
      />
      <firebot-checkbox 
          label="Strip URLs"
          model="effect.stripUrls"
      />
      <firebot-checkbox 
          label="Filter Bad Words (via npm bad-words)"
          model="effect.filterBadWords"
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
      // This is apparently how we set defaults
      if ($scope.effect.message == null) {
        $scope.effect.message = "$chatMessage";
      }
      if ($scope.effect.filterNonASCII == null) {
        $scope.effect.filterNonASCII = true;
      }
      if ($scope.effect.stripUrls == null) {
        $scope.effect.stripUrls = true;
      }
      if ($scope.effect.filterBadWords == null) {
        $scope.effect.filterBadWords = true;
      }
      if ($scope.effect.replaceUsernames == null) {
        $scope.effect.replaceUsernames = true;
      }
      if ($scope.effect.ttsNameKey == null) {
        $scope.effect.ttsNameKey = "tts-name";
      }
      if ($scope.effect.stripEmotes == null) {
        $scope.effect.stripEmotes = true;
      }
      if ($scope.effect.emotesList == null) {
        $scope.effect.emotesList = "$chatMessageEmoteNames";
      }
    },
    async onTriggerEvent(event) {
      try {
        const { effect } = event;
        const options = await parseOptions(effect, runRequest.modules.userDb);
        const response = parseMessage(options);
        return {
          success: true,
          outputs: response,
        };
      } catch {
        return {
          success: false,
        };
      }
    },
  };
}

type ScriptParams = Record<string, string>;

const script: Firebot.CustomScript<ScriptParams> = {
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
    return {};
  },
  run: async (runRequest) => {
    runRequest.modules.effectManager.registerEffect(makeEffect(runRequest));
  },
};

export default script;
