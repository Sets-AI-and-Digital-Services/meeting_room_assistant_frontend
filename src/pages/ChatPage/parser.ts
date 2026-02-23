import type { ChatResponse } from "./types";

export function defaultParseBotText(res: ChatResponse): string {
  if (typeof res?.message === "string" && res.message.trim()) return res.message;
  return "Received a response from the server.";
}