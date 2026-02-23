import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import { endpoints } from "../../api/endpoints";
import { useChat } from "../../hooks/useChat";
import { useSessionBoot } from "../../hooks/useSessionBoot";

import { ChatMessages } from "./components/ChatMessages";
import { ChatShell } from "./components/ChatShell";
import { ChatComposer } from "./components/ChatComposer";
import { defaultParseBotText } from "./parser";

import { CalendarDrawer } from "../../calendar/CalendarDrawer";
import { RoomCalendar } from "../../calendar/RoomCalendar";
import type { RoomBooking } from "./types";

export default function ChatPage() {
  const { sessionId, isReady, hasError } = useSessionBoot();

  const chat = useChat(sessionId, {
    endpoint: endpoints.chat,
    parseBotText: defaultParseBotText,
  });

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Pull bookings from the latest assistant message (until we have a calendar endpoint per room)
  const latestBookings: RoomBooking[] = useMemo(() => {
    for (let i = chat.messages.length - 1; i >= 0; i--) {
      const m = chat.messages[i];
      if (m.role === "assistant" && m.payload?.roomBookings?.length) {
        return m.payload.roomBookings;
      }
    }
    return [];
  }, [chat.messages]);

  const onSelectRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setIsCalendarOpen(true);
  }, []);

  const banners =
    !isReady && !hasError
      ? [
          {
            kind: "warn" as const,
            text: "Connecting… creating your session automatically.",
          },
        ]
      : hasError
        ? [
            {
              kind: "error" as const,
              text: "Server is not reachable. Please check CORS or API availability.",
            },
          ]
        : undefined;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute w-64 h-64 rounded-full top-40 left-20 bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 rounded-full h-80 w-80 bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative px-6 py-8 mx-auto max-w-7xl">
        {/* header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <span className="text-sm font-semibold tracking-wide">AI</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm text-white/60">
                Meeting Room Assistant
              </div>
              <div className="text-lg font-semibold tracking-tight">
                Bank Scheduler{" "}
                <span className="ml-2 rounded-full bg-amber-400/10 px-2 py-0.5 text-sm text-amber-200 ring-1 ring-amber-300/15">
                  Enterprise
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 ring-1 ring-white/10">
            <span
              className={`h-2 w-2 rounded-full ${
                isReady
                  ? "bg-emerald-500"
                  : hasError
                    ? "bg-rose-500"
                    : "bg-amber-500"
              }`}
            />
            <span className="text-sm text-white/75">
              {isReady ? "Connected" : hasError ? "Offline" : "Connecting…"}
            </span>
          </div>
        </motion.header>

        {/* main */}
        <div className="grid grid-cols-1 gap-6 mt-10 lg:grid-cols-12">
          {/* left */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-4"
          >
            <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 backdrop-blur">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-300/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Smart booking assistant
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight">
                Book rooms in seconds.
              </h1>

              <p className="mt-4 text-white/70">
                Ask naturally and the assistant will check availability, suggest
                the best room, and open the room calendar.
              </p>

              <div className="w-full h-px mt-7 bg-gradient-to-r from-emerald-400/40 via-amber-300/25 to-transparent" />

              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  "Capacity-aware",
                  "Conference-ready",
                  "Conflict-safe",
                  "Fast suggestions",
                ].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-sm rounded-full bg-white/5 text-white/70 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {selectedRoomId ? (
                <div className="p-4 mt-6 text-sm rounded-2xl bg-emerald-500/10 text-emerald-100 ring-1 ring-emerald-300/15">
                  Selected room:{" "}
                  <span className="font-semibold">{selectedRoomId}</span>
                  <div className="mt-1 text-sm text-emerald-100/70">
                    Calendar is available in the right panel.
                  </div>
                </div>
              ) : null}
            </div>
          </motion.section>

          {/* right */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="lg:col-span-8"
          >
            <ChatShell
              header={
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold">Assistant</div>
                    <div className="text-sm text-white/55">
                      {isReady
                        ? "Ready. Tell me your meeting details."
                        : hasError
                          ? "Can’t connect to server."
                          : "Preparing your session…"}
                    </div>
                  </div>
                  <div className="px-3 py-1 text-sm rounded-full bg-amber-400/10 text-amber-200 ring-1 ring-amber-300/15">
                    Secure
                  </div>
                </div>
              }
              footer={
                <ChatComposer
                  value={chat.input}
                  onChange={chat.setInput}
                  onSend={chat.send}
                  disabled={!isReady || hasError}
                  isSending={chat.isSending}
                />
              }
            >
              <ChatMessages
                messages={chat.messages}
                isSending={chat.isSending}
                banners={banners}
                onSelectRoom={onSelectRoom}
              />
            </ChatShell>
          </motion.section>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between mt-8 text-sm text-white/35">
          <span>© {new Date().getFullYear()} Bank Scheduling Assistant</span>
          <span>Dark mode • Premium UI</span>
        </div>
      </div>

      {/* Calendar Drawer */}
      <CalendarDrawer
        open={isCalendarOpen && !!selectedRoomId}
        title="Room availability"
        subtitle={
          latestBookings.length
            ? "Showing booked blocks from the assistant response."
            : "No bookings data yet."
        }
        onClose={() => setIsCalendarOpen(false)}
      >
        {selectedRoomId ? (
          <RoomCalendar roomId={selectedRoomId} bookings={latestBookings} />
        ) : null}
      </CalendarDrawer>
    </div>
  );
}
