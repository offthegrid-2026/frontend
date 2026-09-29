import { authFetch } from "./httpClient";
import { extractErrorMessage } from "./apiError";

// `identifier` is exactly one of { ticketCode } (from the QR) or { userId } (manual entry).
// Both endpoints answer 200 for every outcome and put the result in `status`:
// VALID | NOT_FOUND | ALREADY_SCANNED.

async function postScan(path, identifier) {
    const res = await authFetch(path, {
        method: "POST",
        body: JSON.stringify(identifier),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(extractErrorMessage(data));
    }

    return data; // { status, userId, name, ticketTypeCode, scannedAt, scannedBy }
}

// Read-only: who is this, and have they already entered?
export function lookupTicket(identifier) {
    return postScan("/api/v1/scan/lookup", identifier);
}

// Marks the ticket as entered. Returns ALREADY_SCANNED if another gate got there first.
export function checkInTicket(identifier) {
    return postScan("/api/v1/scan/check-in", identifier);
}
