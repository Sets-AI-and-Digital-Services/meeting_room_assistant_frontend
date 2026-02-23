import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import type { ChatMessage } from "../types";

export function ChatMessages({
  messages,
  isSending,
  banners,
  onSelectRoom,
}: {
  messages: ChatMessage[];
  isSending: boolean;
  banners?: { kind: "info" | "warn" | "error"; text: string }[];
  onSelectRoom?: (roomId: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, isSending]);

  return (
    <div ref={ref} className="h-full p-6 space-y-3 overflow-auto">
      <AnimatePresence initial={false}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <ChatBubble m={m} onSelectRoom={onSelectRoom} />
          </motion.div>
        ))}
      </AnimatePresence>

      {banners?.map((b, i) => (
        <div
          key={i}
          className={
            b.kind === "error"
              ? "max-w-[85%] rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-100 ring-1 ring-rose-400/20"
              : b.kind === "warn"
              ? "max-w-[85%] rounded-2xl bg-amber-400/10 p-4 text-sm text-amber-100 ring-1 ring-amber-300/15"
              : "max-w-[85%] rounded-2xl bg-white/7 p-4 text-sm text-white/70 ring-1 ring-white/10"
          }
        >
          {b.text}
        </div>
      ))}

      {isSending ? (
        <div className="max-w-[85%] rounded-2xl bg-white/7 p-4 text-sm text-white/70 ring-1 ring-white/10">
          Thinking…
        </div>
      ) : null}
    </div>
  );
}