// Shared z-index counter so any modal (custom portal or react-bootstrap
// Modal) that opens later always stacks above everything already open,
// regardless of nesting direction (List -> Add form -> Picker -> its own
// Add form, etc). Call getNextModalZIndex() once per "open" cycle.
let current = 1050;

export function getNextModalZIndex(): number {
  current += 20;
  return current;
}