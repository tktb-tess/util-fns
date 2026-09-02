let encoder: TextEncoder | null = null;
let id: ReturnType<typeof setTimeout> | null = null;

export function getTextEncoder() {
  if (id != null) {
    clearTimeout(id);
  }
  encoder ??= new TextEncoder();
  id = setTimeout(() => (encoder = null), 1000 * 60 * 5);
  return encoder;
}
