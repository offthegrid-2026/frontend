import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/usersApi";
import { getToken } from "../lib/token";
import { isProfileComplete } from "../lib/isProfileComplete";

// Sits inside RequireAuth. Fetches the current user once, and only renders the nested
// route if their profile is actually complete — otherwise sends them to finish it.
// Passes the already-fetched user down via Outlet context so children (Dashboard, and
// future protected pages) don't need to fetch it again.
export default function RequireCompleteProfile() {
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getCurrentUser();
                if (cancelled) return;

                if (!isProfileComplete(data)) {
                    navigate("/create-account", { replace: true });
                    return;
                }

                setUser(data);
                setStatus("ready");
            } catch (err) {
                if (cancelled) return;

                // authFetch already clears the token on a 401 -> if it's gone now,
                // this was an auth failure (expired/invalid session), not a real error.
                if (!getToken()) {
                    navigate("/", { replace: true });
                    return;
                }

                setError(err.message);
                setStatus("error");
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    if (status === "loading") {
        return (
            <section className="h-screen w-screen bg-[#F8FFF4] flex items-center justify-center">
                <p className="poppins-medium text-gray-500 text-xl">Loading...</p>
            </section>
        );
    }

    if (status === "error") {
        return (
            <section className="h-screen w-screen bg-[#F8FFF4] flex items-center justify-center">
                <p className="poppins-medium text-red-500 text-xl">{error}</p>
            </section>
        );
    }

    return <Outlet context={{ user }} />;
}
