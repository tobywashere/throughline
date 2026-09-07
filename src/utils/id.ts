let counter = 0;

export function generateId(): string {
  counter = (counter + 1) % 1_000_000;
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${counter.toString(36)}-${random}`;
}
