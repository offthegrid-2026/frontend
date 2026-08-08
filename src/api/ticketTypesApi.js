import { authFetch } from "./httpClient";
import { extractErrorMessage } from "./apiError";

export async function listTicketTypes() {
    const res = await authFetch("/api/v1/ticket-types", { method: "GET" });
    const data = await res.json().catch(() => ([]));

    if (!res.ok) {
        throw new Error(extractErrorMessage(data));
    }

    return data; // TicketTypePublicDto[]: { code, displayName, priceRupees, status }
}
