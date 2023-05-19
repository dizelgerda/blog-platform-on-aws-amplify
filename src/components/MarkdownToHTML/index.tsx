import { marked } from "marked";
import { useEffect, useState } from "react";

interface MarkdownToHTMLProps {
  title?: string;
  text: string;
  className?: string;
}

interface HTMLObject {
  __html: string;
}

const initialState: HTMLObject = {
  __html: "",
};

export default function MarkdownToHTML({
  title,
  text,
  className,
}: MarkdownToHTMLProps) {
  const [html, setHtml] = useState<HTMLObject>(initialState);

  if (title) {
    text = "# " + title + "\n\n" + text;
  }

  async function renderHTML() {
    const htmlText = marked.parse(text, {
      async: false,
      mangle: false,
      headerIds: false,
    });
    setHtml({ __html: htmlText });
  }

  useEffect(() => {
    renderHTML();
  }, [text]);

  return (
    <article className={className} dangerouslySetInnerHTML={html}></article>
  );
}
