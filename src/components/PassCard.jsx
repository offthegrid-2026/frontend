import EyeSpinner from "./EyeSpinner";

export default function PassCard({
    name,
    color,
    priceRupees,
    status = "ON_SALE", // "ON_SALE" | "SOLD_OUT" | "COMING_SOON" — matches the backend's TicketTypeStatus enum
    loading = false,
    onBuy
}) {
    const soldOut = status === "SOLD_OUT";
    const comingSoon = status === "COMING_SOON";
    const disabled = soldOut || comingSoon || loading;

    const buttonLabel = soldOut
        ? "SOLD OUT"
        : comingSoon
            ? "Coming Soon"
            : "Buy Now";

    return (
        <div
            className="
                relative
                w-75
                h-125
                p-3
                flex
                flex-col
                overflow-hidden
                select-none
            "
            style={{ backgroundColor: color }}
        >

            {soldOut && (
                <div
                    className="
                        absolute
                        top-12
                        -right-17.5
                        w-70
                        py-3
                        bg-[#111111]
                        text-[#D9A514]
                        text-3xl
                        font-bold
                        uppercase
                        text-center
                        rotate-45
                        z-10
                    "
                >
                    SOLD OUT
                </div>
            )}

            {comingSoon && (
                <div
                    className="
                        absolute
                        top-12
                        -right-17.5
                        w-70
                        py-3
                        bg-[#B5FF61]
                        text-black
                        text-3xl
                        font-bold
                        uppercase
                        text-center
                        rotate-45
                        z-10
                    "
                >
                    Coming Soon
                </div>
            )}

            <h2
                className="
                    font-perandory
                    text-white
                    text-8xl
                    uppercase
                    leading-[0.85]
                "
            >
                {name}
            </h2>

            {priceRupees != null && (
                <p className="poppins-semibold text-white text-3xl mt-3">
                    ₹{Math.round(Number(priceRupees)).toLocaleString("en-IN")}
                </p>
            )}

            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (!disabled) {
                        onBuy();
                    }
                }}
                className={`
                    mt-auto
                    w-full
                    h-20
                    bg-[#F8FFF4]
                    text-2xl
                    poppins-semibold
                    transition-all
                    duration-200
                    flex
                    items-center
                    justify-center

                    ${soldOut
                        ? "text-red-600 cursor-not-allowed"
                        : comingSoon
                            ? "text-gray-500 cursor-not-allowed"
                            : loading
                                ? "text-black cursor-wait opacity-70"
                                : "text-black cursor-pointer hover:scale-[0.99] active:scale-[0.97]"
                    }
                `}
            >
                {loading ? <EyeSpinner size={28} color="#111111" glintColor="#ffffff" /> : buttonLabel}
            </button>

        </div>
    );
}
