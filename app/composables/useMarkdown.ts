/* eslint-disable @typescript-eslint/ban-ts-comment */
import MarkdownIt from "markdown-it";
// @ts-expect-error
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
// @ts-expect-error
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
// @ts-expect-error
import MarkdownItSub from "markdown-it-sub";
// @ts-expect-error
import MarkdownItSup from "markdown-it-sup";
// @ts-expect-error
import MarkdownItTasklists from "markdown-it-task-lists";
import MarkdownItTOC from "markdown-it-toc-done-right";

let markdown: MarkdownIt | null = null;

export const useMarkdown = () => {
  if (!markdown)
    markdown = new MarkdownIt()
      .use(MarkdownItSub)
      .use(MarkdownItSup)
      .use(MarkdownItTOC)
      .use(MarkdownItAbbr)
      .use(MarkdownItAnchor)
      .use(MarkdownItFootnote)
      .use(MarkdownItTasklists)
      .use(MarkdownItHighlightjs);

  const render = (input: string) => markdown?.render(input) ?? "";

  return { render };
};
