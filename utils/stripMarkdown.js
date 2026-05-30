export function stripMarkdown(text) {
  if (!text || typeof text !== "string") return "";

  let out = text.replace(/\r\n/g, "\n");

  out = out.replace(/```[\s\S]*?```/g, (block) =>
    block.replace(/^```[^\n]*\n?/, "").replace(/```$/, "")
  );
  out = out.replace(/`([^`]+)`/g, "$1");
  out = out.replace(/^#{1,6}\s+/gm, "");
  out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  out = out.replace(/__([^_]+)__/g, "$1");
  out = out.replace(/\*([^*]+)\*/g, "$1");
  out = out.replace(/_([^_]+)_/g, "$1");
  out = out.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  out = out.replace(/^[-*+]\s+/gm, "• ");
  out = out.replace(/^\s*>\s?/gm, "");

  return out.replace(/\n{3,}/g, "\n\n").trim();
}
