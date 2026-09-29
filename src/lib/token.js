const TOKEN_KEY = "otg_token";

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Reads the `role` claim from the JWT payload ("SCANNER", or null for a regular attendee).
// Only decodes, never verifies — it decides which page to show, while the backend still
// checks the signature and role on every request, so a forged claim gets nowhere.
export function getTokenRole() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(payload)).role ?? null;
    } catch {
        return null;
    }
}
