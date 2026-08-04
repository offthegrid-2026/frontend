function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
}

// Mirrors the backend's ProfileCompletionChecker so both sides agree on what "complete" means.
export function isProfileComplete(user) {
    return (
        hasText(user?.firstName) &&
        hasText(user?.lastName) &&
        hasText(user?.phoneNumber) &&
        hasText(user?.cityState) &&
        hasText(user?.collegeOrOrg)
    );
}
