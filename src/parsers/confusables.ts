import { remove, obfuscate } from "confusables";

export function hasConfusables(text: string) {
  return text === remove(text);
}
export function cleanConfusables(text: string) {
  return remove(text);
}
export function toConfusables(text: string) {
  return obfuscate(text);
}
