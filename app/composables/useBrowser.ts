import { useMediaQuery } from "@vueuse/core";

export const useBrowser = () => {
  const isMobile = useMediaQuery("(max-width: 950px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isNative = false; // todo: bind capacitor detection here - loic

  return { isMobile, isDesktop, isNative };
};
