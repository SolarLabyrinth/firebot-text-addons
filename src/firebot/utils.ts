import type {
  Firebot,
  RunRequest,
} from "@crowbartools/firebot-custom-scripts-types";
import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";

export type ScriptParams = {
  replacementCSV: string;
  allowedWords: string;
};

export type Script = Firebot.CustomScript<ScriptParams>;
export type ScriptRunRequest = RunRequest<ScriptParams>;

export function registerReplaceVariable(
  runRequest: ScriptRunRequest,
  replaceVariable: ReplaceVariable
) {
  runRequest.modules.replaceVariableManager.registerReplaceVariable(
    replaceVariable
  );
}
