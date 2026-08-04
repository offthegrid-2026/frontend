import {useState} from "react";


export default function Form() {

    const [state, setState] = useState("create");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [city, setCity] = useState("");
    const [userState, setUserState] = useState("");


    return (
        <>
            <form
                className="flex flex-col gap-5 bg-[#F8FFF4] h-full p-8"
            >
                {/*Header*/}
                <img
                    src="/public/images/eyeform.svg"
                    alt=""
                    width="200px"
                />

                {/*Dynamic*/}
                <div
                    className="flex-1 flex flex-col gap-3 "
                >
                    {state === "sign" && (
                        <>
                            <h2 className="text-black poppins-regular text-lg">
                                Sign in or create an account
                            </h2>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                            />
                            <button
                                type="button"
                                className="w-full h-12 bg-black text-white poppins-regular text-lg cursor-pointer
                                hover:scale-99 active:scale-100 transition-all ease-in-out duration-200"
                            >
                                Send OTP
                            </button>
                            <p className="-mt-3 text-center poppins-light-italic text-sm text-gray-500 cursor-pointer
                            underline underline-offset-1 decoration-transparent hover:decoration-gray-500 transition-all duration-300">
                                Facing problems? Contact Us
                            </p>
                        </>
                    )}

                    {state === "otp" && (
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

                            <button
                                type="button"
                                className="w-full h-12 bg-black text-white poppins-regular text-lg cursor-pointer
                                hover:scale-99 active:scale-100 transition-all ease-in-out duration-200"
                            >
                                Submit OTP
                            </button>

                            <p
                                className="-mt-3 text-center poppins-light-italic text-sm text-gray-500 cursor-pointer
                                underline underline-offset-1 decoration-transparent hover:decoration-gray-500 transition-all duration-300"
                            >
                                Facing problems? Contact Us
                            </p>
                        </>
                    )}

                    {state === "create" && (
                        <>
                            <h2 className="text-black poppins-regular text-lg">
                                Create Account
                            </h2>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="flex-1 min-w-0 h-12 w-60 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                                />

                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
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
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="College/Organization"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                            />

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="flex-1 min-w-0 h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                                />

                                <input
                                    type="text"
                                    placeholder="State"
                                    value={userState}
                                    onChange={(e) => setUserState(e.target.value)}
                                    className="flex-1 min-w-0 h-12 px-4 border border-black bg-transparent poppins-light text-md placeholder:text-gray-500 outline-none"
                                />
                            </div>

                            <button
                                type="button"
                                className="w-full h-12 bg-black text-white poppins-regular text-lg cursor-pointer
            hover:scale-99 active:scale-100 transition-all ease-in-out duration-200"
                            >
                                Create Account
                            </button>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className="flex justify-center items-center gap-2 text-blue-700 poppins-light text-[12px]">

                    <button type="button" className="underline underline-offset-1 decoration-transparent hover:decoration-blue-700 transition-all duration-300">
                        Privacy Policy
                    </button>

                    <span className="text-gray-400">|</span>

                    <button type="button" className="underline underline-offset-1 decoration-transparent hover:decoration-blue-700 transition-all duration-300">
                        Terms of Use
                    </button>

                    <span className="text-gray-400">|</span>

                    <button type="button" className="underline underline-offset-1 decoration-transparent hover:decoration-blue-700 transition-all duration-300">
                        Code of Conduct
                    </button>
                </div>

            </form>
        </>
    )
}