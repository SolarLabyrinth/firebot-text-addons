import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { containsNonASCIICharacters } from "./message-parser";

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
    const { logger } = runRequest.modules;

    runRequest.modules.effectManager.registerEffect({
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
              rows="4"
              cols="40"
          />
          <firebot-checkbox 
              label="Strip Non ASCII Characters"
              model="effect.stripNonASCII"
          />
          <firebot-checkbox 
              label="Strip Non ASCII Characters"
              model="effect.stripUrls"
          />
          <firebot-checkbox 
              label="Strip Bad Words (via npm)"
              model="effect.stripBadWords"
          />
          <firebot-checkbox 
              label="Replace @Usernames with custom metadata names"
              model="effect.replaceUsernames"
          />
        </eos-container>
      `,
      optionsController: ($scope) => {
        // logger.info(JSON.stringify($scope, null, 4));
      },
      async onTriggerEvent(event) {
        const effect = event.effect as any;

        const message = effect.message;
        const stripNonASCII = effect.stripNonASCII;
        const stripBadWords = effect.stripBadWords;
        const replaceUsernames = effect.replaceUsernames;

        let cleanMessage = message;
        if (stripNonASCII && containsNonASCIICharacters(cleanMessage)) {
          cleanMessage = "";
        }

        // logger.info(stripNonASCII);
        // logger.info(JSON.stringify(event, null, 4));
        return {
          success: true,
          outputs: {
            cleanMessage: cleanMessage,
          },
        };
      },
    });

    // const metadata = await runRequest.modules.userDb.getUserMetadata(
    //   "solarlabyrinth",
    //   "tts-name"
    // );

    // logger.info(JSON.stringify(runRequest.trigger.metadata, null, 2));
    // logger.info(runRequest.parameters.message);
    // logger.info(metadata);
  },
};

export default script;
