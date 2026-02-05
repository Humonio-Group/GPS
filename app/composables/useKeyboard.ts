export function useKeyboard() {
  const handleChatShortcuts = (event: KeyboardEvent) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    event.stopPropagation();
  };

  return {
    handleChatShortcuts,
  };
}
