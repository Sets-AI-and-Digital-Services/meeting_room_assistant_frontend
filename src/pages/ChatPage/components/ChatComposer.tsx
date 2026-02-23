export function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
  isSending,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  isSending: boolean;
}) {
  return (
    <div className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/25 ring-1 ring-white/10"
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isSending}
          placeholder={disabled ? "Connecting…" : "Type your request…"}
          className="w-full text-sm bg-transparent outline-none text-white/85 placeholder:text-white/35 disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={disabled || isSending || !value.trim()}
          className="px-4 py-2 text-sm rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/15 disabled:opacity-50"
        >
          Send
        </button>
      </form>
      <div className="mt-2 text-sm text-white/35">
        Session is created automatically on page open.
      </div>
    </div>
  );
}
