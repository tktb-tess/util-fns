let encoder: TextEncoder | undefined;

export function getTextEncoder() {
  encoder ??= new TextEncoder();
  return encoder;
}
