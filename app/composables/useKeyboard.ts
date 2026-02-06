export function useKeyboard() {
  const handleChatShortcuts = (event: KeyboardEvent, cb: () => void | Promise<void>) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    event.stopPropagation();
    cb();
  };

  return {
    handleChatShortcuts,
  };
}
