import Form from "../components/Form"

export default function UserSign() {
    return (
        <>
            <section className="h-screen w-screen bg-black">
                <div className="flex gap-20 justify-center items-stretch h-full w-full px-20 py-30">

                    {/*Permanent*/}
                    <div className="flex flex-col gap-5">
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

                    {/*Dynamic*/}
                    <div className="w-100">
                        <Form />
                    </div>
                </div>
            </section>
        </>
    )
}