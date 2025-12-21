import type { HTMLAttributes } from "vue";

export interface ComposingProps {
  name?: string;
  class?: HTMLAttributes["class"];
}
export interface PageRootProps extends ComposingProps {
  wrapper?: boolean;
  wrapperClass?: HTMLAttributes["class"];
}
