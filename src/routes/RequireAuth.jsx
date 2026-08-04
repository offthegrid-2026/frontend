import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../lib/token";

// Blocks access to any nested route unless a token is present. Does not validate the
// token itself (that happens server-side on each API call) — this just stops an
// unauthenticated browser from ever reaching the page.
export default function RequireAuth() {
    const token = getToken();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
