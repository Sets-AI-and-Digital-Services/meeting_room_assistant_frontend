import type { ReactNode } from "react";

export function ChatShell({
  header,
  children,
  footer,
}: {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex h-[72vh] flex-col overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
      <div className="border-b border-white/10">{header}</div>
      <div className="flex-1 overflow-hidden">{children}</div>
      <div className="border-t border-white/10">{footer}</div>
    </div>
  );
}