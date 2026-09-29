import { Navigate, Outlet } from "react-router-dom";
import { getToken, getTokenRole } from "../lib/token";

// Guards /scanner. Only a scanner token gets through; an attendee who types the URL
// goes back to their dashboard. The backend enforces the same rule on /api/v1/scan/**.
export default function RequireScanner() {
    if (!getToken()) {
        return <Navigate to="/" replace />;
    }

    if (getTokenRole() !== "SCANNER") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
