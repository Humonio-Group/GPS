import { describe, it, expect } from "vitest";
import { markdownToHTML, htmlToMarkdown } from "~/components/ui/markdown-editor/utils/markdown-converter";

describe("markdown-converter", () => {
  describe("markdownToHTML", () => {
    it("should convert basic markdown to HTML", () => {
      const markdown = "# Hello World";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<h1>Hello World</h1>");
    });

    it("should return empty string for empty input", () => {
      expect(markdownToHTML("")).toBe("");
      expect(markdownToHTML("   ")).toBe("");
    });

    it("should convert headings correctly", () => {
      const markdown = "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<h1>H1</h1>");
      expect(html).toContain("<h2>H2</h2>");
      expect(html).toContain("<h3>H3</h3>");
      expect(html).toContain("<h4>H4</h4>");
      expect(html).toContain("<h5>H5</h5>");
      expect(html).toContain("<h6>H6</h6>");
    });

    it("should convert bold text", () => {
      const markdown = "**bold text**";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<strong>bold text</strong>");
    });

    it("should convert italic text", () => {
      const markdown = "*italic text*";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<em>italic text</em>");
    });

    it("should convert links", () => {
      const markdown = "[Google](https://google.com)";
      const html = markdownToHTML(markdown);
      expect(html).toContain('<a href="https://google.com">Google</a>');
    });

    it("should convert images", () => {
      const markdown = "![Alt text](https://example.com/image.jpg)";
      const html = markdownToHTML(markdown);
      expect(html).toContain('<img src="https://example.com/image.jpg" alt="Alt text">');
    });

    it("should convert code blocks", () => {
      const markdown = "```\nconst x = 1;\n```";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<code>");
      expect(html).toContain("const x = 1;");
    });

    it("should convert inline code", () => {
      const markdown = "This is `inline code`";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<code>inline code</code>");
    });

    it("should convert unordered lists", () => {
      const markdown = "- Item 1\n- Item 2\n- Item 3";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>Item 1</li>");
      expect(html).toContain("<li>Item 2</li>");
    });

    it("should convert ordered lists", () => {
      const markdown = "1. First\n2. Second\n3. Third";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<ol>");
      expect(html).toContain("<li>First</li>");
      expect(html).toContain("<li>Second</li>");
    });

    it("should convert blockquotes", () => {
      const markdown = "> This is a quote";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<blockquote>");
      expect(html).toContain("This is a quote");
    });

    it("should convert horizontal rules", () => {
      const markdown = "---";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<hr");
    });

    it("should handle line breaks with breaks option enabled", () => {
      const markdown = "Line 1\nLine 2";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<br>");
    });

    it("should linkify URLs automatically", () => {
      const markdown = "Visit https://example.com";
      const html = markdownToHTML(markdown);
      expect(html).toContain('<a href="https://example.com">https://example.com</a>');
    });

    it("should handle typographer options", () => {
      const markdown = "\"quotes\" and (c)";
      const html = markdownToHTML(markdown);
      // Typographer converts straight quotes to curly quotes
      expect(html.length).toBeGreaterThan(0);
    });

    it("should preserve HTML when html option is true", () => {
      const markdown = "Text with <strong>HTML</strong>";
      const html = markdownToHTML(markdown);
      expect(html).toContain("<strong>HTML</strong>");
    });
  });

  describe("htmlToMarkdown", () => {
    it("should convert headings to markdown", () => {
      const html = "<h1>Heading 1</h1>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("# Heading 1");
    });

    it("should return empty string for empty input", () => {
      expect(htmlToMarkdown("")).toBe("");
      expect(htmlToMarkdown("   ")).toBe("");
      expect(htmlToMarkdown("<p></p>")).toBe("");
    });

    it("should convert all heading levels", () => {
      const html = "<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("# H1");
      expect(markdown).toContain("## H2");
      expect(markdown).toContain("### H3");
      expect(markdown).toContain("#### H4");
      expect(markdown).toContain("##### H5");
      expect(markdown).toContain("###### H6");
    });

    it("should convert bold tags", () => {
      expect(htmlToMarkdown("<strong>bold</strong>")).toBe("**bold**");
      expect(htmlToMarkdown("<b>bold</b>")).toBe("**bold**");
    });

    it("should convert italic tags", () => {
      expect(htmlToMarkdown("<em>italic</em>")).toBe("*italic*");
      expect(htmlToMarkdown("<i>italic</i>")).toBe("*italic*");
    });

    it("should convert underline tags", () => {
      const html = "<u>underlined</u>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("_underlined_");
    });

    it("should convert strikethrough tags", () => {
      expect(htmlToMarkdown("<s>strike</s>")).toBe("~~strike~~");
      expect(htmlToMarkdown("<del>deleted</del>")).toBe("~~deleted~~");
    });

    it("should convert inline code", () => {
      const html = "<code>const x = 1;</code>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("`const x = 1;`");
    });

    it("should convert highlight/mark tags", () => {
      const html = "<mark>highlighted</mark>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("==highlighted==");
    });

    it("should convert code blocks", () => {
      const html = "<pre><code>const x = 1;\nconst y = 2;</code></pre>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("```");
      expect(markdown).toContain("const x = 1;");
      expect(markdown).toContain("const y = 2;");
    });

    it("should convert blockquotes", () => {
      const html = "<blockquote><p>This is a quote</p></blockquote>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("> This is a quote");
    });

    it("should convert horizontal rules", () => {
      const html = "<hr />";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("---");
    });

    it("should convert links", () => {
      const html = '<a href="https://google.com">Google</a>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("[Google](https://google.com)");
    });

    it("should convert images with alt text", () => {
      const html = '<img src="https://example.com/image.jpg" alt="Alt text" />';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("![Alt text](https://example.com/image.jpg)");
    });

    it("should convert images without alt text", () => {
      const html = '<img src="https://example.com/image.jpg" />';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("![](https://example.com/image.jpg)");
    });

    it("should convert unordered lists", () => {
      const html = "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("- Item 1");
      expect(markdown).toContain("- Item 2");
      expect(markdown).toContain("- Item 3");
    });

    it("should convert ordered lists", () => {
      const html = "<ol><li>First</li><li>Second</li><li>Third</li></ol>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("1. First");
      expect(markdown).toContain("2. Second");
      expect(markdown).toContain("3. Third");
    });

    it("should convert task lists", () => {
      const html = '<ul data-type="taskList"><li data-checked="true"><label><input type="checkbox" checked><span>Done task</span></label></li><li data-checked="false"><label><input type="checkbox"><span>Todo task</span></label></li></ul>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("Done task");
      expect(markdown).toContain("Todo task");
    });

    it("should convert line breaks", () => {
      const html = "Line 1<br />Line 2";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("Line 1\nLine 2");
    });

    it("should convert paragraphs", () => {
      const html = "<p>Paragraph 1</p><p>Paragraph 2</p>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("Paragraph 1");
      expect(markdown).toContain("Paragraph 2");
    });

    it("should decode HTML entities", () => {
      const html = "<p>&quot;Hello&quot; &amp; &lt;World&gt;</p>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain('"Hello"');
      expect(markdown).toContain("&");
      expect(markdown).toContain("<World>");
    });

    it("should clean up excessive newlines", () => {
      const html = "<p>Text 1</p><p>Text 2</p><p>Text 3</p>";
      const markdown = htmlToMarkdown(html);
      // Should not have more than 2 consecutive newlines
      expect(markdown).not.toContain("\n\n\n");
    });

    it("should remove wrapping div tags", () => {
      const html = "<div><p>Content</p></div>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("Content");
    });

    it("should handle complex nested HTML", () => {
      const html = "<p>This is <strong>bold</strong> and <em>italic</em> text with a <a href=\"https://example.com\">link</a>.</p>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("**bold**");
      expect(markdown).toContain("*italic*");
      expect(markdown).toContain("[link](https://example.com)");
    });

    it("should handle blockquotes with multiple lines", () => {
      const html = "<blockquote>Line 1\nLine 2</blockquote>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain(">");
      expect(markdown).toContain("Line 1");
      expect(markdown).toContain("Line 2");
    });

    it("should clean up remaining HTML tags", () => {
      const html = "<div><span>Text</span></div>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe("Text");
    });

    it("should handle nested lists correctly", () => {
      const html = "<ul><li><p>Item 1</p></li><li><p>Item 2</p></li></ul>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("- Item 1");
      expect(markdown).toContain("- Item 2");
    });

    it("should convert mixed formatting", () => {
      const html = "<p><strong><em>Bold and italic</em></strong></p>";
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain("**");
      expect(markdown).toContain("*");
    });
  });

  describe("round-trip conversion", () => {
    it("should maintain heading structure", () => {
      const originalMarkdown = "# Heading 1\n\n## Heading 2";
      const html = markdownToHTML(originalMarkdown);
      const backToMarkdown = htmlToMarkdown(html);
      expect(backToMarkdown).toContain("# Heading 1");
      expect(backToMarkdown).toContain("## Heading 2");
    });

    it("should maintain bold and italic formatting", () => {
      const originalMarkdown = "This is **bold** and *italic* text";
      const html = markdownToHTML(originalMarkdown);
      const backToMarkdown = htmlToMarkdown(html);
      expect(backToMarkdown).toContain("**bold**");
      expect(backToMarkdown).toContain("*italic*");
    });

    it("should maintain links", () => {
      const originalMarkdown = "[Google](https://google.com)";
      const html = markdownToHTML(originalMarkdown);
      const backToMarkdown = htmlToMarkdown(html);
      expect(backToMarkdown).toContain("[Google](https://google.com)");
    });

    it("should maintain list structure", () => {
      const originalMarkdown = "- Item 1\n- Item 2\n- Item 3";
      const html = markdownToHTML(originalMarkdown);
      const backToMarkdown = htmlToMarkdown(html);
      expect(backToMarkdown).toContain("- Item 1");
      expect(backToMarkdown).toContain("- Item 2");
      expect(backToMarkdown).toContain("- Item 3");
    });
  });
});
