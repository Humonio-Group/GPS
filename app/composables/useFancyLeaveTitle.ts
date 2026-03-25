let originalTitle = "";

export const useFancyLeaveTitle = () => {
  const { t } = useI18n();

  window.addEventListener("focus", () => {
    if (!originalTitle.length) return;

    useHead({
      title: originalTitle,
    });

    originalTitle = "";
  });
  window.addEventListener("blur", () => {
    originalTitle = document.title;

    useHead({
      title: `${t("labels.miss-you")} - ${originalTitle}`,
    });
  });
};
