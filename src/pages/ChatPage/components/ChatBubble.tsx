import type { ChatMessage } from "../types";
import { AssistantRichPanel } from "./AssistantRichPanel";

export function ChatBubble({
  m,
  onSelectRoom,
  bookedBookingId,
  onSendRoomId,
}: {
  m: ChatMessage;
  onSelectRoom?: (roomId: string) => void;
  bookedBookingId: string | null;
  onSendRoomId: any;
}) {
  const isUser = m.role === "user";

  return (
    <div className={isUser ? "ml-auto max-w-[85%]" : "max-w-[85%]"}>
      <div
        className={
          isUser
            ? "rounded-2xl bg-emerald-500/12 p-4 text-base text-white ring-1 ring-emerald-300/15"
            : "rounded-2xl bg-white/7 p-4 text-base text-white/90 ring-1 ring-white/10"
        }
      >
        {m.text}

        {!isUser ? (
          <AssistantRichPanel
            roomOptions={m.payload?.roomOptions}
            roomBookings={m.payload?.roomBookings}
            onSelectRoom={onSelectRoom}
            bookedBookingId={bookedBookingId}
            onSendRoomId={onSendRoomId}
          />
        ) : null}
      </div>
    </div>
  );
}
