import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { requestOtp } from "../api/authApi";

export default function SignForm() {
    const navigate = useNavigate();
    const { email, setEmail } = useOutletContext();

    const [emailError, setEmailError] = useState("");
    const [sending, setSending] = useState(false);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setEmailError("Email is required");
            return false;
        }

        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return false;
        }

        setEmailError("");
        return true;
    };

    return (
        <>
            <h2 className="text-black poppins-regular text-lg">
                Sign in or create an account
            </h2>
            <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);

                    if (emailError) {
                        setEmailError("");
                    }
                }}
                className="w-full h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
            />
            {emailError && (
                <p className="-mt-3 text-[12px] text-red-500 poppins-regular">
                    {emailError}
                </p>
            )}
            <button
                type="button"
                disabled={sending}
                onClick={async () => {
                    if (!validateEmail()) return;

                    setSending(true);
                    try {
                        await requestOtp(email.trim().toLowerCase());
                        navigate("/otp");
                    } catch (err) {
                        setEmailError(err.message);
                    } finally {
                        setSending(false);
                    }
                }}
                className="w-full h-12 bg-black text-white poppins-regular text-lg cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-99 active:scale-100 transition-all ease-in-out duration-200"
            >
                {sending ? "Sending..." : "Send OTP"}
            </button>
            <p className="-mt-2 text-center poppins-light-italic text-sm text-gray-500 cursor-pointer
            underline underline-offset-1 decoration-transparent hover:decoration-gray-500 transition-all duration-300">
                Facing problems? Contact Us
            </p>
        </>
    );
}
