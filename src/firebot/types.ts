import type {
  Firebot,
  RunRequest,
} from "@crowbartools/firebot-custom-scripts-types";
import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";

export type ScriptParams = {
  replacementCSV: string;
};

export type Script = Firebot.CustomScript<ScriptParams>;
export type ScriptRunRequest = RunRequest<ScriptParams>;

export { ReplaceVariable };
