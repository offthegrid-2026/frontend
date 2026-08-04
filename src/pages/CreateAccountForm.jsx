import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api/usersApi";

export default function CreateAccountForm() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [city, setCity] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [phoneError, setPhoneError] = useState("");
    const validatePhone = () => {
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phone.trim()) {
            setPhoneError("Phone number is required");
            return false;
        }

        if (!phoneRegex.test(phone)) {
            setPhoneError("Please enter a valid 10-digit phone number");
            return false;
        }

        setPhoneError("");
        return true;
    };

    const [createError, setCreateError] = useState("");
    const validateCreateForm = () => {

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !phone.trim() ||
            !college.trim() ||
            !city.trim()
        ) {
            setCreateError("All fields marked * are required.");
            return false;
        }

        if (!validatePhone()) {
            return false;
        }

        setCreateError("");

        return true;
    };

    return (
        <>
            <h2 className="text-black poppins-regular text-lg">
                Create Account
            </h2>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="First Name*"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);

                        if (createError) {
                            setCreateError("");
                        }
                    }}
                    className="flex-1 min-w-0 h-12 w-60 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                />

                <input
                    type="text"
                    placeholder="Last Name*"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);

                        if (createError) {
                            setCreateError("");
                        }
                    }}
                    className="flex-1 min-w-0 h-12 w-60 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                />
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value="+91"
                    disabled
                    className="w-18 h-12 text-center border border-black bg-transparent poppins-light text-md outline-none"
                />

                <input
                    type="tel"
                    placeholder="Phone Number*"
                    value={phone}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        if (value.length <= 10) {
                            setPhone(value);
                        }

                        if (phoneError) {
                            setPhoneError("");
                        }

                        if (createError) {
                            setCreateError("");
                        }
                    }}
                    className="flex-1 h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                />
            </div>
            {phoneError && (
                <p className="-mt-3 text-[12px] text-red-500 poppins-regular">
                    {phoneError}
                </p>
            )}

            <input
                type="text"
                placeholder="College/Organization*"
                value={college}
                onChange={(e) => {
                    setCollege(e.target.value);

                    if (createError) {
                        setCreateError("");
                    }
                }}
                className="w-full h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
            />

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="City with State*"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);

                        if (createError) {
                            setCreateError("");
                        }
                    }}
                    className="flex-1 min-w-0 h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                />

            </div>
            {createError && (
                <p className="-mt-3 text-[12px] text-red-500 poppins-regular">
                    {createError}
                </p>
            )}
            <button
                type="button"
                disabled={submitting}
                onClick={async () => {

                    if (!validateCreateForm()) return;

                    setSubmitting(true);
                    try {
                        await updateProfile({
                            firstName,
                            lastName,
                            phoneNumber: phone,
                            cityState: city,
                            collegeOrOrg: college,
                        });
                        navigate("/dashboard");
                    } catch (err) {
                        setCreateError(err.message);
                    } finally {
                        setSubmitting(false);
                    }
                }}
                className="w-full h-12 bg-black text-white poppins-regular text-lg cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-99 active:scale-100 transition-all ease-in-out duration-200"
            >
                {submitting ? "Creating..." : "Create Account"}
            </button>
        </>
    );
}
