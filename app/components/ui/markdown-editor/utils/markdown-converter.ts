import MarkdownIt from "markdown-it";

// Initialize markdown-it with plugins you already have
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

/**
 * Convert Markdown to HTML using markdown-it
 */
export function markdownToHTML(markdown: string): string {
  if (!markdown || markdown.trim() === "") {
    return "";
  }

  return md.render(markdown);
}

/**
 * Convert HTML to Markdown
 * This is a simplified converter that handles common Tiptap output
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === "" || html === "<p></p>") {
    return "";
  }

  let markdown = html;

  // Remove wrapping div/article tags
  markdown = markdown.replace(/^<(?:div|article)[^>]*>|<\/(?:div|article)>$/gi, "");

  // Headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Underline (not standard markdown, but supported by some parsers)
  markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, "_$1_");

  // Strikethrough
  markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, "~~$1~~");
  markdown = markdown.replace(/<del[^>]*>(.*?)<\/del>/gi, "~~$1~~");

  // Code inline
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Highlight/Mark
  markdown = markdown.replace(/<mark[^>]*>(.*?)<\/mark>/gi, "==$1==");

  // Code blocks
  markdown = markdown.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gis, (match, code) => {
    return `\`\`\`\n${code.trim()}\n\`\`\`\n\n`;
  });

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
    const lines = content.trim().split("\n");
    return lines.map((line: string) => `> ${line.replace(/<\/?p[^>]*>/gi, "").trim()}`).join("\n") + "\n\n";
  });

  // Horizontal rule
  markdown = markdown.replace(/<hr[^>]*\/?>/gi, "\n---\n\n");

  // Links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");

  // Images
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Unordered lists
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gis, (m: string, item: string) => {
      return `- ${item.replace(/<\/?p[^>]*>/gi, "").trim()}\n`;
    }) + "\n";
  });

  // Ordered lists
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
    let index = 1;
    return content.replace(/<li[^>]*>(.*?)<\/li>/gis, (m: string, item: string) => {
      return `${index++}. ${item.replace(/<\/?p[^>]*>/gi, "").trim()}\n`;
    }) + "\n";
  });

  // Task lists
  markdown = markdown.replace(/<ul[^>]*data-type="taskList"[^>]*>(.*?)<\/ul>/gis, (match, content) => {
    return content.replace(/<li[^>]*data-checked="(true|false)"[^>]*>(.*?)<\/li>/gis, (m: string, checked: string, item: string) => {
      const checkbox = checked === "true" ? "[x]" : "[ ]";
      return `- ${checkbox} ${item.replace(/<[^>]+>/g, "").trim()}\n`;
    }) + "\n";
  });

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gis, "$1\n\n");

  // Clean up remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  markdown = markdown
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

  // Clean up excessive newlines
  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  return markdown.trim();
}
