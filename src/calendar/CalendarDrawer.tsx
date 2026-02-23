import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";

export function CalendarDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Centered Modal */}
          <motion.aside
            className="fixed inset-0 z-50 grid p-4 place-items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
          >
            {/* Gradient frame */}
            <motion.div
              initial={{ y: 10, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-[1px] rounded-[28px] bg-[conic-gradient(from_180deg_at_50%_50%,rgb(var(--nbe-green)/0.55),rgb(var(--nbe-gold)/0.55),rgb(var(--nbe-orange)/0.55),rgb(var(--nbe-green)/0.55))] blur-[10px] opacity-60" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070A12]/90 shadow-[0_22px_80px_rgba(0,0,0,0.65)] backdrop-blur">
                {/* subtle inner glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
                <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[rgb(var(--nbe-green)/0.16)] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[rgb(var(--nbe-gold)/0.12)] blur-3xl" />

                <div className="flex flex-col w-full max-h-[85vh]">
                  {/* Top “handle” */}
                  <div className="w-12 h-1 mx-auto mt-3 rounded-full bg-white/15" />

                  <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/10">
                    <div>
                      <div className="text-sm font-semibold text-white/90">
                        {title}
                      </div>
                      {subtitle ? (
                        <div className="mt-1 text-sm text-white/55">
                          {subtitle}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-2 text-sm rounded-xl bg-white/10 text-white/85 ring-1 ring-white/10 hover:bg-white/15"
                    >
                      Close
                    </button>
                  </div>

                  <div className="flex-1 p-6 overflow-auto">{children}</div>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
