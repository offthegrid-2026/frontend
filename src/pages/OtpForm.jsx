import { useState } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { verifyOtp } from "../api/authApi";
import { saveToken } from "../lib/token";

export default function OtpForm() {
    const navigate = useNavigate();
    const { email } = useOutletContext();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [verifying, setVerifying] = useState(false);

    // Reached directly (e.g. a page refresh) with no email known yet -> send back to the start.
    if (!email) {
        return <Navigate to="/" replace />;
    }

    const validateOTP = () => {
        const enteredOTP = otp.join("");

        if (enteredOTP.length !== 6) {
            setOtpError("Please enter the complete 6-digit OTP.");
            return false;
        }

        setOtpError("");
        return true;
    };

    return (
        <>
            <h2 className="text-black poppins-regular text-lg">
                OTP Sent to Email
            </h2>

            <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");

                            const updatedOtp = [...otp];
                            updatedOtp[index] = value;
                            setOtp(updatedOtp);

                            if (otpError) {
                                setOtpError("");
                            }

                            if (value && index < 5) {
                                document.getElementById(`otp-${index + 1}`)?.focus();
                            }
                        }}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Backspace" &&
                                !otp[index] &&
                                index > 0
                            ) {
                                document.getElementById(`otp-${index - 1}`)?.focus();
                            }
                        }}
                        id={`otp-${index}`}
                        className="w-12 h-12 border border-black bg-transparent text-center text-2xl poppins-regular outline-none"
                    />
                ))}
            </div>
            {otpError && (
                <p className="-mt-3 text-[12px] text-red-500 poppins-regular">
                    {otpError}
                </p>
            )}
            <button
                type="button"
                disabled={verifying}
                onClick={async () => {
                    if (!validateOTP()) return;

                    setVerifying(true);
                    try {
                        const data = await verifyOtp(email.trim().toLowerCase(), otp.join(""));
                        saveToken(data.token);
                        navigate(data.profileCompleted ? "/dashboard" : "/create-account");
                    } catch (err) {
                        setOtpError(err.message);
                    } finally {
                        setVerifying(false);
                    }
                }}
                className="w-full h-12 bg-black text-white poppins-regular text-lg cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-99 active:scale-100 transition-all ease-in-out duration-200"
            >
                {verifying ? "Verifying..." : "Submit OTP"}
            </button>

            <p
                className="-mt-2 text-center poppins-light-italic text-sm text-gray-500 cursor-pointer
                underline underline-offset-1 decoration-transparent hover:decoration-gray-500 transition-all duration-300"
            >
                Facing problems? Contact Us
            </p>
        </>
    );
}
