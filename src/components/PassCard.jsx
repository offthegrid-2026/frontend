export default function PassCard({
                                     name,
                                     color,
                                     soldOut = false,
                                     onBuy
                                 }) {
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

            <button
                type="button"
                disabled={soldOut}
                onClick={() => {
                    if (!soldOut) {
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

                    ${
                    soldOut
                        ? "text-red-600 cursor-not-allowed"
                        : "text-black cursor-pointer hover:scale-[0.99] active:scale-[0.97]"
                }
                `}
            >
                {soldOut ? "SOLD OUT" : "Buy Now"}
            </button>

        </div>
    );
}