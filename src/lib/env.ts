export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string | undefined,
};

if (!env.apiBaseUrl) {
    // Fail fast in dev to avoid silent bugs
    // eslint-disable-next-line no-console
    console.warn("Missing VITE_API_BASE_URL. Add it to .env");
}