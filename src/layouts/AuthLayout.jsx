import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    const [email, setEmail] = useState("");

    return (
        <section className="h-screen w-screen bg-black">
            <img src="/public/images/bg-pattern.svg" alt="" className="fixed left-70 z-1 rotate-90 scale-250 opacity-2"/>
            <div className="flex gap-20 justify-center items-stretch h-full w-full px-20 py-30">

                {/*Permanent*/}
                <div className="hidden lg:flex flex-col gap-5 z-10">
                    <h1
                        className="text-black text-6xl uppercase tektur-condensed font-bold text-center
                        bg-[#B5FF61] px-8"
                    >
                        Don't miss out
                    </h1>
                    <img
                        src="/public/images/OTG-white.svg"
                        alt=""
                        className="w-100 h-auto"
                    />
                    <h2
                        className="text-[#B5FF61] text-8xl uppercase font-perandory"
                    >
                        2026 Passes
                    </h2>
                    <p
                        className="text-white text-2xl poppins-medium text-start uppercase"
                    >
                        why sign-up or sign-in?
                    </p>
                    <p
                        className="text-white text-2xl poppins-light text-start w-100"
                    >
                        It’s fast and secure, plus your check-out becomes a breeze. It’s easy to apply your referral discounts, for later add-ons.
                    </p>
                </div>

                {/*Dynamic — form shell shared by all auth steps*/}
                <div className="w-100 z-10">
                    <form
                        className="flex flex-col gap-5 bg-[#F8FFF4] h-full p-8"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    >
                        <img
                            src="/public/images/eyeform.svg"
                            alt=""
                            width="200px"
                        />

                        <div className="flex-1 flex flex-col gap-3">
                            <Outlet context={{ email, setEmail }} />
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
                </div>
            </div>
        </section>
    );
}
