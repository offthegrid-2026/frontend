// Backend error responses come in two shapes:
//  - business exceptions -> { message: "...", status: "..." }
//  - @Valid validation failures -> { fieldName: "message", ... } (no top-level "message" key)
// This normalizes both into a single display string.
export function extractErrorMessage(data) {
    if (!data) return "Something went wrong. Please try again.";

    if (typeof data.message === "string") {
        return data.message;
    }

    const fieldMessages = Object.values(data).filter((v) => typeof v === "string");
    if (fieldMessages.length > 0) {
        return fieldMessages[0];
    }

    return "Something went wrong. Please try again.";
}
