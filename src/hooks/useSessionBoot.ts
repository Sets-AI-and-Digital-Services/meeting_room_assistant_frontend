import { useEffect, useState } from "react";
import { apiPost } from "../api/api";
import { endpoints } from "../api/endpoints";
import { getSessionId, setSessionId } from "../session/session.storage";


type CreateSessionResponse = {
  session_id: string;
  timestamp: string;
};

export function useSessionBoot() {
  const [sessionId, setSessionIdState] = useState<string | null>(getSessionId());
  const [isReady, setIsReady] = useState<boolean>(!!sessionId);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        setHasError(false);
        const data = await apiPost<CreateSessionResponse>(endpoints.createSession);
        if (cancelled) return;

        setSessionId(data.session_id);
        setSessionIdState(data.session_id);
        setIsReady(true);
      } catch {
        if (cancelled) return;
        setHasError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return { sessionId, isReady, hasError };
}