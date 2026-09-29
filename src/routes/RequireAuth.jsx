import { Navigate, Outlet } from "react-router-dom";
import { getToken, getTokenRole } from "../lib/token";

// Blocks access to any nested route unless a token is present. Does not validate the
// token itself (that happens server-side on each API call) — this just stops an
// unauthenticated browser from ever reaching the page.
export default function RequireAuth() {
    const token = getToken();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Attendee pages call /users/me, which a scanner token can't use (scanners have no
    // user account) — send gate staff to their own page instead.
    if (getTokenRole() === "SCANNER") {
        return <Navigate to="/scanner" replace />;
    }

    return <Outlet />;
}
