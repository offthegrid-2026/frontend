import { authFetch } from "./httpClient";
import { extractErrorMessage } from "./apiError";

// Fetches the ticket PDF (regenerated server-side on every call) and opens it
// in a new tab. Can't be a plain <a href> — the endpoint requires a Bearer
// token, which only authFetch attaches.
export async function downloadTicketPdf() {
    const res = await authFetch("/api/v1/tickets/me/pdf", { method: "GET" });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(extractErrorMessage(data));
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Deferred, not immediate: the new tab needs the blob URL to still be
    // valid while it loads the PDF into its viewer.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
