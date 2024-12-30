import { ReplaceVariable, ScriptRunRequest } from "./types";

export function registerReplaceVariable(
  runRequest: ScriptRunRequest,
  replaceVariable: ReplaceVariable
) {
  runRequest.modules.replaceVariableManager.registerReplaceVariable(
    replaceVariable
  );
}
