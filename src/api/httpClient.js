import { API_BASE_URL } from "../config/api";
import { getToken, clearToken } from "../lib/token";

// fetch wrapper for endpoints that require a JWT. Attaches Authorization automatically
// and clears a rejected token so a stale/expired one doesn't keep getting resent.
export async function authFetch(path, options = {}) {
    const token = getToken();

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        clearToken();
    }

    return res;
}
