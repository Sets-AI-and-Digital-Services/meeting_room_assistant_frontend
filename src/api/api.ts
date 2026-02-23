const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function apiPost<TResponse>(
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: body === undefined ? "" : JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as TResponse;
}