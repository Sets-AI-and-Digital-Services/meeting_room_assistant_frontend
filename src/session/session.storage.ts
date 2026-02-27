const KEY = "bank_ai_session_id";

export function getSessionId(): string | null {
  try {
    const v = localStorage.getItem(KEY);
    return v && v.trim() ? v : null;
  } catch {
    return null;
  }
}

export function setSessionId(id: string) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // ignore
  }
}

export function clearSessionId() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
