let current = 1050;

export function getNextModalZIndex(): number {
  current += 20;
  return current;
}