let encoder: TextEncoder | null = null;
let id: ReturnType<typeof setTimeout> | null = null;
const delay = 1000 * 600;

export function getTextEncoder() {
  if (!encoder) {
    encoder = new TextEncoder();
  }

  if (id != null) {
    clearTimeout(id);
    id = null;
  }

  id = setTimeout(() => {
    encoder = null;
    id = null;
  }, delay);

  return encoder;
}
