import { useMediaQuery } from "@vueuse/core";

export function useResponsive() {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return { isMobile, isTablet, isDesktop };
}
