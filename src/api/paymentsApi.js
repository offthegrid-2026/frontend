import { authFetch } from "./httpClient";
import { extractErrorMessage } from "./apiError";

// Only the ticket type code is ever sent — the backend derives amountPaise
// itself from the locked TicketType row server-side. The client never gets
// a chance to tell the server what to charge.
export async function createOrder(ticketType) {
    const res = await authFetch("/api/v1/payments/orders", {
        method: "POST",
        body: JSON.stringify({ ticketType }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(extractErrorMessage(data));
    }

    return data; // { razorpayOrderId, amountPaise, currency, razorpayKeyId, ticketType }
}

export async function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const res = await authFetch("/api/v1/payments/verify", {
        method: "POST",
        body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(extractErrorMessage(data));
    }

    return data; // { success, ticketCode, message }
}
