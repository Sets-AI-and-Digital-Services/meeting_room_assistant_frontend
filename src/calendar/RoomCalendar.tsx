import { useMemo, useState } from "react";
import type { RoomBooking } from "../pages/ChatPage/types";

type Day = { date: Date; key: string; label: string };

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday as first day
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function labelDay(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
}
function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function RoomCalendar({
  roomId,
  bookings,
  anchorDate,
}: {
  roomId: string;
  bookings: RoomBooking[];
  anchorDate?: Date;
}) {
  const [cursorDate, setCursorDate] = useState<Date>(anchorDate ?? new Date());

  const weekStart = useMemo(() => startOfWeek(cursorDate), [cursorDate]);
  const todayKey = useMemo(() => toISODate(new Date()), []);

  const days: Day[] = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(weekStart, i);
        return { date, key: toISODate(date), label: labelDay(date) };
      }),
    [weekStart],
  );

  const hours = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, h) => `${h}`.padStart(2, "0") + ":00"),
    [],
  );

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, RoomBooking[]>();
    for (const b of bookings) {
      const list = map.get(b.Date) ?? [];
      list.push(b);
      map.set(b.Date, list);
    }
    return map;
  }, [bookings]);

  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6);
    const startTxt = weekStart.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
    });
    const endTxt = end.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
    });
    return `${startTxt} – ${endTxt}`;
  }, [weekStart]);

  return (
    <div className="space-y-4">
      {/* Summary + Controls */}
      <div className="relative p-4 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-16 left-1/3 h-44 w-72 rounded-full bg-[rgb(var(--nbe-green)/0.16)] blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-[rgb(var(--nbe-gold)/0.10)] blur-3xl" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white/90">
              Room Calendar
            </div>
            <div className="mt-1 text-sm text-white/55">
              Room: <span className="text-white/85">{roomId}</span> •{" "}
              <span className="text-white/85">{weekLabel}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <span className="h-2 w-2 rounded-full bg-[rgb(var(--nbe-gold)/0.9)]" />
              <span className="text-sm text-[rgb(var(--nbe-gold)/0.9)]">
                Booked
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCursorDate(addDays(cursorDate, -7))}
              className="px-3 py-2 text-sm rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setCursorDate(new Date())}
              className="rounded-xl bg-[rgb(var(--nbe-green)/0.14)] px-3 py-2 text-sm text-white/85 ring-1 ring-[rgb(var(--nbe-green)/0.25)] hover:bg-[rgb(var(--nbe-green)/0.18)]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setCursorDate(addDays(cursorDate, 7))}
              className="px-3 py-2 text-sm rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="relative overflow-hidden rounded-2xl bg-black/25 ring-1 ring-white/10">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-20 left-10 h-60 w-60 rounded-full bg-[rgb(var(--nbe-orange)/0.10)] blur-3xl" />
          <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-[rgb(var(--nbe-green)/0.12)] blur-3xl" />
        </div>

        {/* Sticky header */}
        <div className="sticky top-0 z-10 grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/10 bg-[#070A12]/70 backdrop-blur">
          <div className="px-3 py-3 text-sm text-white/50">Time</div>

          {days.map((d) => {
            const isToday = d.key === todayKey;
            return (
              <div
                key={d.key}
                className={[
                  "border-l border-white/10 px-3 py-3 text-sm font-semibold",
                  isToday
                    ? "text-[rgb(var(--nbe-gold)/0.95)]"
                    : "text-white/75",
                ].join(" ")}
              >
                {d.label}
                {isToday ? (
                  <span className="ml-2 rounded-full bg-[rgb(var(--nbe-gold)/0.12)] px-2 py-0.5 text-[10px] ring-1 ring-[rgb(var(--nbe-gold)/0.25)]">
                    Today
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* time column */}
          <div className="border-r border-white/10">
            {hours.map((h) => (
              <div
                key={h}
                className="flex h-12 items-start border-b border-white/5 px-3 pt-2 text-[11px] text-white/45"
              >
                {h}
              </div>
            ))}
          </div>

          {/* day columns */}
          {days.map((d) => {
            const dayBookings = bookingsByDate.get(d.key) ?? [];
            const isToday = d.key === todayKey;

            return (
              <div
                key={d.key}
                className={[
                  "relative border-r border-white/10 last:border-r-0",
                  isToday ? "bg-white/[0.02]" : "",
                ].join(" ")}
              >
                {/* hourly cells */}
                {hours.map((h) => (
                  <div key={h} className="h-12 border-b border-white/5" />
                ))}

                {/* booking blocks */}
                {dayBookings.map((b) => {
                  const start = clamp(timeToMinutes(b.StartTime), 0, 24 * 60);
                  const end = clamp(timeToMinutes(b.EndTime), 0, 24 * 60);

                  const topPx = (start / 60) * 48;
                  const heightPx = Math.max(16, ((end - start) / 60) * 48);

                  return (
                    <div
                      key={b.BookingID}
                      className="group absolute left-2 right-2 overflow-hidden rounded-xl bg-[linear-gradient(135deg,rgba(var(--nbe-gold),0.18),rgba(var(--nbe-orange),0.10))] ring-1 ring-[rgb(var(--nbe-gold)/0.24)] shadow-[0_10px_26px_rgba(0,0,0,0.35)] hover:bg-[linear-gradient(135deg,rgba(var(--nbe-gold),0.24),rgba(var(--nbe-orange),0.14))]"
                      style={{ top: topPx + 6, height: heightPx - 8 }}
                      title={`${b.StartTime}–${b.EndTime}`}
                    >
                      <div className="px-3 py-2 text-[11px] text-white/90">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--nbe-gold)/0.95)]" />
                          <span className="font-semibold">Booked</span>
                          <span className="text-white/65">
                            {b.StartTime}–{b.EndTime}
                          </span>
                        </div>
                      </div>

                      {/* subtle hover shine */}
                      <div className="absolute inset-0 transition-opacity duration-200 opacity-0 pointer-events-none group-hover:opacity-100">
                        <div className="absolute h-20 -inset-x-10 -top-10 rotate-12 bg-white/10 blur-xl" />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-white/40">
        Empty spaces are available. Booked blocks use NBE gold/orange accent.
      </div>
    </div>
  );
}
