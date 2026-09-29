// Local dev sets this in .env.development (the backend runs on its own port).
// In production nginx serves the site and proxies /api on the same domain, so it's left
// unset and calls go to relative paths like "/api/v1/...". The .env.* files are gitignored,
// so without this fallback a server build would call "undefined/api/v1/...".
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
