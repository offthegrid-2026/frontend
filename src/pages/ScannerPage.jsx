import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner, setZXingModuleOverrides } from "@yudiel/react-qr-scanner";
// zxing-wasm arrives via the scanner library (it's not a direct dependency). This is its
// decoder, used on browsers with no native QR detection (iPhone Safari, Firefox).
import zxingReaderWasm from "zxing-wasm/reader/zxing_reader.wasm?url";
import { AlertTriangle, CheckCircle2, LogOut, XCircle } from "lucide-react";
import { checkInTicket, lookupTicket } from "../api/scanApi";
import { logout } from "../api/authApi";
import { clearToken, getToken } from "../lib/token";
import EyeSpinner from "../components/EyeSpinner";

// Serve the 1.1 MB decoder from our own server. By default the library downloads it
// from a public CDN the first time the camera opens, which stalls on weak venue data.
setZXingModuleOverrides({
    locateFile: (path, prefix) => (path.endsWith(".wasm") ? zxingReaderWasm : prefix + path),
});

// Ticket codes are 32 chars of A-Z/0-9 (HashcodeGenerator). Anything else scanned — a URL,
// a payment QR — is rejected here without a server round-trip.
const TICKET_CODE = /^[A-Z0-9]{32}$/;

// Same names attendees see in the store.
const PASS_LABELS = { EARLY_BIRD: "Early Bird", NORMAL: "VIP Pass" };

const CAMERA_ERRORS = {
    "permission-denied": "Camera access was blocked. Allow it in your browser settings, or enter the User ID below.",
    "insecure-context": "The camera only works over HTTPS. Use the https:// address, or enter the User ID below.",
    "no-camera": "No camera found on this device. Enter the User ID below.",
    "in-use": "Another app is using the camera. Close it and reload this page.",
};

function formatIst(instant) {
    if (!instant) return "";
    return new Date(instant).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function ScannerPage() {
    const navigate = useNavigate();

    // "scanning" -> "result" (VALID / NOT_FOUND / ALREADY_SCANNED) -> "entered"
    const [phase, setPhase] = useState("scanning");
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);
    const [identifier, setIdentifier] = useState(null); // { ticketCode } or { userId }
    const [error, setError] = useState("");
    const [cameraError, setCameraError] = useState("");
    const [manualId, setManualId] = useState("");

    // The camera can report the same QR several times before React re-renders;
    // this ref makes sure only the first one starts a lookup.
    const lockedRef = useRef(false);

    function reset() {
        lockedRef.current = false;
        setPhase("scanning");
        setResult(null);
        setIdentifier(null);
        setError("");
        setManualId("");
    }

    function handleRequestError(err) {
        // authFetch clears the token on a 401 - the session is gone, so back to login.
        if (!getToken()) {
            navigate("/", { replace: true });
            return;
        }
        setError(err.message);
    }

    async function runLookup(id) {
        lockedRef.current = true;
        setError("");
        setIdentifier(id);
        setBusy(true);
        try {
            const data = await lookupTicket(id);
            setResult(data);
            setPhase("result");
        } catch (err) {
            lockedRef.current = false;
            handleRequestError(err);
        } finally {
            setBusy(false);
        }
    }

    function handleScan(codes) {
        if (lockedRef.current || codes.length === 0) return;

        const text = codes[0].rawValue.trim();
        if (!TICKET_CODE.test(text)) {
            lockedRef.current = true;
            setIdentifier({ ticketCode: text });
            setResult({ status: "NOT_FOUND" });
            setPhase("result");
            return;
        }
        runLookup({ ticketCode: text });
    }

    function handleManualSubmit(e) {
        e.preventDefault();
        const id = Number(manualId.trim());
        if (!Number.isInteger(id) || id <= 0) {
            setError("Enter a valid User ID.");
            return;
        }
        runLookup({ userId: id });
    }

    async function handleEnter() {
        setError("");
        setBusy(true);
        try {
            const data = await checkInTicket(identifier);
            setResult(data);
            // ALREADY_SCANNED here means another gate admitted them a moment ago.
            setPhase(data.status === "VALID" ? "entered" : "result");
        } catch (err) {
            handleRequestError(err);
        } finally {
            setBusy(false);
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch {
            // Clear the session locally even if the server call fails.
        } finally {
            clearToken();
            navigate("/", { replace: true });
        }
    }

    const scanning = phase === "scanning";

    return (
        <main className="min-h-dvh bg-[#F8FFF4] flex flex-col">

            <header className="flex items-center justify-between px-5 py-4 bg-black text-white">
                <h1 className="tektur font-semibold text-2xl uppercase">Gate Scanner</h1>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 poppins-medium text-sm cursor-pointer
                    hover:opacity-80 transition-opacity"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            <section className="flex-1 w-full max-w-md mx-auto px-5 py-5 flex flex-col gap-5">

                {/* Kept mounted between scans so the camera doesn't restart for every attendee. */}
                <div className={scanning ? "flex flex-col gap-3" : "hidden"}>
                    <div className="relative w-full aspect-square bg-black overflow-hidden">
                        <Scanner
                            onScan={handleScan}
                            onError={(err) => setCameraError(CAMERA_ERRORS[err.kind] ?? "Couldn't start the camera. Enter the User ID below.")}
                            formats={["qr_code"]}
                            constraints={{ facingMode: "environment" }}
                            paused={!scanning || busy}
                            components={{ finder: true, torch: true }}
                            styles={{ container: { width: "100%", height: "100%" } }}
                        />
                        {busy && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 z-10">
                                <EyeSpinner size={64} color="#F0F0F0" glintColor="#555555" />
                                <p className="poppins-medium text-white">Checking…</p>
                            </div>
                        )}
                    </div>

                    <p className="poppins-regular text-gray-600 text-center">
                        Point the camera at the QR code on the ticket.
                    </p>

                    {cameraError && (
                        <p className="poppins-regular text-sm text-red-600">{cameraError}</p>
                    )}

                    {error && (
                        <p className="poppins-regular text-sm text-red-600">{error}</p>
                    )}

                    <form onSubmit={handleManualSubmit} className="flex flex-col gap-2 pt-3 border-t border-gray-300">
                        <label htmlFor="manual-user-id" className="poppins-medium text-sm text-gray-700">
                            QR not scanning? Enter the User ID printed on the ticket
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="manual-user-id"
                                type="text"
                                inputMode="numeric"
                                placeholder="e.g. 20261"
                                value={manualId}
                                onChange={(e) => {
                                    setManualId(e.target.value.replace(/\D/g, ""));
                                    if (error) setError("");
                                }}
                                className="flex-1 min-w-0 h-12 px-4 border border-black bg-white poppins-regular outline-none"
                            />
                            <button
                                type="submit"
                                disabled={busy || !manualId}
                                className="h-12 px-5 bg-black text-white poppins-medium cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Check
                            </button>
                        </div>
                    </form>
                </div>

                {!scanning && result && (
                    <ResultCard
                        phase={phase}
                        result={result}
                        identifier={identifier}
                        busy={busy}
                        error={error}
                        onEnter={handleEnter}
                        onDecline={reset}
                        onNext={reset}
                    />
                )}

            </section>
        </main>
    );
}

function ResultCard({ phase, result, identifier, busy, error, onEnter, onDecline, onNext }) {
    const details = (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 poppins-regular">
            <dt className="opacity-70">User ID</dt>
            <dd>{result.userId}</dd>
            <dt className="opacity-70">Pass</dt>
            <dd>{PASS_LABELS[result.ticketTypeCode] ?? result.ticketTypeCode}</dd>
        </dl>
    );

    const nextButton = (
        <button
            type="button"
            onClick={onNext}
            className="w-full h-14 bg-black text-white poppins-semibold text-lg cursor-pointer"
        >
            Scan next
        </button>
    );

    if (phase === "entered") {
        return (
            <div className="flex flex-col gap-5">
                <div className="bg-[#B5FF61] text-black p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={28} />
                        <p className="tektur font-semibold text-2xl uppercase">Entered</p>
                    </div>
                    <p className="font-perandory text-5xl uppercase leading-none">{result.name}</p>
                    {details}
                </div>
                {nextButton}
            </div>
        );
    }

    if (result.status === "VALID") {
        return (
            <div className="flex flex-col gap-5">
                <div className="bg-white border-4 border-[#B5FF61] p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 size={28} />
                        <p className="tektur font-semibold text-2xl uppercase">Valid ticket</p>
                    </div>
                    <p className="font-perandory text-5xl uppercase leading-none">{result.name}</p>
                    {details}
                </div>

                {error && <p className="poppins-regular text-sm text-red-600">{error}</p>}

                <button
                    type="button"
                    onClick={onEnter}
                    disabled={busy}
                    className="w-full h-14 bg-black text-white poppins-semibold text-lg cursor-pointer
                    flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {busy ? <EyeSpinner size={32} color="#F0F0F0" glintColor="#555555" /> : "Mark as Entered"}
                </button>
                <button
                    type="button"
                    onClick={onDecline}
                    disabled={busy}
                    className="w-full h-14 border-2 border-red-600 text-red-600 poppins-semibold text-lg cursor-pointer
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Decline
                </button>
            </div>
        );
    }

    if (result.status === "ALREADY_SCANNED") {
        return (
            <div className="flex flex-col gap-5">
                <div className="bg-[#FF5634] text-white p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={28} />
                        <p className="tektur font-semibold text-2xl uppercase">Already entered</p>
                    </div>
                    <p className="font-perandory text-5xl uppercase leading-none">{result.name}</p>
                    {details}
                    <p className="poppins-regular">
                        Entered {formatIst(result.scannedAt)}
                        {result.scannedBy && <> by {result.scannedBy}</>}
                    </p>
                </div>
                {nextButton}
            </div>
        );
    }

    // NOT_FOUND
    const manual = identifier && identifier.userId != null;
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-red-600 text-white p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <XCircle size={28} />
                    <p className="tektur font-semibold text-2xl uppercase">
                        {manual ? "No ticket found" : "Invalid QR"}
                    </p>
                </div>
                <p className="poppins-regular">
                    {manual
                        ? `There is no ticket for User ID ${identifier.userId}.`
                        : "This QR code doesn't match any ticket. Do not admit."}
                </p>
            </div>
            {nextButton}
        </div>
    );
}
