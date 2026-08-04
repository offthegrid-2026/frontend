import { authFetch } from "./httpClient";
import { extractErrorMessage } from "./apiError";

export async function getCurrentUser() {
    const res = await authFetch("/api/v1/users/me", {
        method: "GET",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(extractErrorMessage(data));
    }

    return data; // UserDto
}

export async function updateProfile({ firstName, lastName, phoneNumber, cityState, collegeOrOrg }) {
    const res = await authFetch("/api/v1/users/me", {
        method: "PATCH",
        body: JSON.stringify({ firstName, lastName, phoneNumber, cityState, collegeOrOrg }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(extractErrorMessage(data));
    }

    return data; // UserDto
}
