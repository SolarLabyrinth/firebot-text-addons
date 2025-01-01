import { ScriptRunRequest } from "./utils";

export async function getUsersWithTTSNames(
  runRequest: ScriptRunRequest,
  metadataKey: string
) {
  try {
    type TTSNameQueryResult = {
      username: string;
      displayName: string;
      metadata: Record<string, string>;
      _id: string;
    };
    let viewerDatabase = runRequest.modules.viewerDatabase as any;
    const results: TTSNameQueryResult[] = await viewerDatabase
      .getViewerDb()
      .findAsync({ [`metadata.${metadataKey}`]: { $exists: true } })
      .projection({ username: 1, displayName: 1, metadata: 1 });

    const map = new Map<string, string>();
    for (const result of results) {
      map.set(result.username.toLowerCase(), result.metadata[metadataKey]);
    }
    return map;
  } catch (error) {
    return new Map<string, string>();
  }
}
