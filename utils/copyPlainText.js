import { Platform } from "react-native";
import { stripMarkdown } from "./stripMarkdown";

export async function copyPlainText(text) {
  const plain = stripMarkdown(text);
  if (!plain) return false;

  if (Platform.OS === "web") {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(plain);
      return true;
    }
    if (typeof document !== "undefined") {
      const area = document.createElement("textarea");
      area.value = plain;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    }
    return false;
  }

  const Clipboard = await import("expo-clipboard");
  await Clipboard.setStringAsync(plain);
  return true;
}
