export function useScrollIsland() {
  const progress = ref<number>(0);

  const handleScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? (window.scrollY / max) * 100 : 0;
  };

  onMounted(() => window.addEventListener("scroll", handleScroll));
  onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));

  return {
    progress,

    handleScroll,
  };
}
