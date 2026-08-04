import { API_BASE_URL } from "../config/api";
import { authFetch } from "./httpClient";

async function parseJson(res) {
    try {
        return await res.json();
    } catch {
        return {};
    }
}

export async function requestOtp(email) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await parseJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Could not send OTP. Please try again.");
    }

    return data;
}

export async function verifyOtp(email, otp) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
    });

    const data = await parseJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Invalid OTP. Please try again.");
    }

    return data; // { token, userId, email, profileCompleted }
}

// Requires a valid JWT -> uses authFetch (unlike request-otp/verify-otp, which are public).
export async function logout() {
    const res = await authFetch("/api/v1/auth/logout", {
        method: "POST",
    });

    const data = await parseJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Could not log out. Please try again.");
    }

    return data;
}
