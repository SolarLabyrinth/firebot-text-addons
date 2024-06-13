export type CleanTTSMessageEffectGUIParams = {
  message: string;
  filterNonASCII: boolean;
  stripUrls: boolean;
  filterBadWords: boolean;
  replaceUsernames: boolean;
  ttsNameKey: string;
  stripEmotes: boolean;
  emotesList: string;
};
export type CleanTTSMessageOptions = {
  message: string;
  filterNonASCII: boolean;
  stripUrls: boolean;
  filterBadWords: boolean;
  replaceUsernames: boolean;
  stripEmotes: boolean;
  emotesList: Set<string>;
  atNames: Map<string, string>;
};
export type CleanTTSMessageResponse = {
  ttsParserMessageWasClean: boolean;
  ttsParserTrippedFilter: "ASCII" | "BAD_WORD" | "";
  ttsParserCleanedMessage: string;
};
