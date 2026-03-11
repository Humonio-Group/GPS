export function useHtmlDetection() {
  const containsHtml = (content: string): boolean => /<\/?[a-z][\s\S]*?>/i.test(content);

  return {
    containsHtml,
  };
}
