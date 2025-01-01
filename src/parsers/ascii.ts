export function hasNonAscii(message: string) {
  return /[^ -~]/.test(message);
}
