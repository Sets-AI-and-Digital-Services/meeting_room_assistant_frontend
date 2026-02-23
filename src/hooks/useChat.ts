import { useState } from "react";
import { apiPost } from "../api/api";
import type { ChatConfig, ChatMessage, ChatRequest, ChatResponse } from "../pages/ChatPage/types";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useChat(sessionId: string | null, config: ChatConfig) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: "assistant",
      text: 'Hi! Describe your meeting like: “Sunday 3pm–5pm, 10 people, conference call”.',
      ts: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canSend = !!sessionId && !isSending;

  async function send() {
    const q = input.trim();
    if (!q || !sessionId || isSending) return;

    setMessages((prev) => [...prev, { id: uid(), role: "user", text: q, ts: Date.now() }]);
    setInput("");
    setIsSending(true);

    try {
      const payload: ChatRequest = {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        query: q,
      };

      const res = await apiPost<ChatResponse>(config.endpoint, payload);
      const botText = config.parseBotText(res);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          text: botText,
          ts: Date.now(),
          payload: {
            bookingId: res.booking_id ?? null,
            roomOptions: Array.isArray(res.room_options) ? res.room_options : undefined,
            roomBookings: Array.isArray(res.room_bookings) ? res.room_bookings : undefined,
          },
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          text: `Server error: ${e?.message ?? "Unknown error"}`,
          ts: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return { messages, input, setInput, isSending, canSend, send };
}