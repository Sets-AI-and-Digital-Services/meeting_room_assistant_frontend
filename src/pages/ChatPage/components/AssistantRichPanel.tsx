import { motion } from "framer-motion";
import type { RoomBooking, RoomOption } from "../types";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
      {children}
    </span>
  );
}

function FeatureDot({ ok }: { ok: boolean }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-white/15"}`} />;
}

function groupBookingsByDate(bookings: RoomBooking[]) {
  const m = new Map<string, RoomBooking[]>();
  for (const b of bookings) {
    const arr = m.get(b.Date) ?? [];
    arr.push(b);
    m.set(b.Date, arr);
  }
  return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "2-digit" });
}

export function AssistantRichPanel({
  roomOptions,
  roomBookings,
  onSelectRoom,
}: {
  roomOptions?: RoomOption[];
  roomBookings?: RoomBooking[];
  onSelectRoom?: (roomId: string) => void;
}) {
  const hasRooms = Array.isArray(roomOptions) && roomOptions.length > 0;
  const hasBookings = Array.isArray(roomBookings) && roomBookings.length > 0;

  if (!hasRooms && !hasBookings) return null;

  return (
    <div className="mt-3 space-y-4">
      {hasRooms ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-white/80">Available rooms</div>
            <div className="text-[11px] text-white/45">{roomOptions!.length} options</div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roomOptions!.map((r) => (
              <motion.div
                key={r.RoomID}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="p-4 group rounded-2xl bg-black/25 ring-1 ring-white/10 hover:bg-black/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate text-white/90">{r.RoomName}</div>
                    <div className="mt-1 text-xs text-white/55">
                      {r.Building} • Floor {r.Floor} • {r.RoomID}
                    </div>
                  </div>

                  <div className="shrink-0 rounded-xl bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200 ring-1 ring-emerald-300/15">
                    {r.Capacity} ppl
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Chip><span className="inline-flex items-center gap-1"><FeatureDot ok={r.HasConferenceCall} />Conf</span></Chip>
                  <Chip><span className="inline-flex items-center gap-1"><FeatureDot ok={r.HasVideo} />Video</span></Chip>
                  <Chip><span className="inline-flex items-center gap-1"><FeatureDot ok={r.HasAudio} />Audio</span></Chip>
                  <Chip><span className="inline-flex items-center gap-1"><FeatureDot ok={r.HasDisplay} />Display</span></Chip>
                  <Chip><span className="inline-flex items-center gap-1"><FeatureDot ok={r.HasWhiteboard} />Whiteboard</span></Chip>
                  <Chip><span className="inline-flex items-center gap-1"><FeatureDot ok={r.IsAccessible} />Accessible</span></Chip>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => onSelectRoom?.(r.RoomID)}
                    className="px-3 py-2 text-xs rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
                  >
                    Select room
                  </button>
                  <span className="text-[11px] text-white/45 group-hover:text-white/55">
                    View calendar →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {hasBookings ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-white/80">Bookings preview</div>
            <div className="text-[11px] text-white/45">Grouped by day</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 ring-1 ring-white/10">
            <div className="space-y-3">
              {groupBookingsByDate(roomBookings!).map(([date, list]) => (
                <div key={date} className="p-3 rounded-xl bg-white/5 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white/85">{formatDateLabel(date)}</div>
                    <div className="text-[11px] text-white/50">{date}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {list
                      .slice()
                      .sort((a, b) => a.StartTime.localeCompare(b.StartTime))
                      .map((b) => (
                        <span
                          key={b.BookingID}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-[11px] text-rose-100 ring-1 ring-rose-400/15"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                          {b.StartTime}–{b.EndTime}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[11px] text-white/40">
              Next: show full calendar for selected room.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}