import { FolderCheck, Lock, type LucideIcon } from "lucide-vue-next";

export const useConditionUtils = () => {
  const extractFileName = (path: string): string | undefined => {
    const src = path.match(/src="([^"]+)"/)?.[1];
    return src?.split("/").pop();
  };
  const detectIcon = (path: string): LucideIcon => {
    switch (extractFileName(path)?.split(".")[0]) {
      case "blendedStage.png": return FolderCheck;
      default: return Lock;
    }
  };

  return { detectIcon };
};
