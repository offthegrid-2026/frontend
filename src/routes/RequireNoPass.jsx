import { Navigate, Outlet, useOutletContext } from "react-router-dom";

// Sits inside RequireCompleteProfile, wraps only /store. A user who has
// already paid has nothing to buy — send them back to the dashboard instead
// of letting them re-enter checkout. (The backend would reject a second order
// via AlreadyPaidException anyway; this just stops them getting that far.)
// Reads `user` from the context RequireCompleteProfile already fetched —
// no extra network call — and re-forwards it so StorePage can still read it.
export default function RequireNoPass() {
    const { user } = useOutletContext();

    if (user.paymentStatus) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet context={{ user }} />;
}
