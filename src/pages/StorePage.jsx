import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PassCard from "../components/PassCard";
import { listTicketTypes } from "../api/ticketTypesApi";
import { createOrder, verifyPayment } from "../api/paymentsApi";
import { loadRazorpayScript } from "../lib/loadRazorpayScript";

// Visual identity per ticket type - deliberately kept on the frontend rather
// than driven by the backend's admin-editable `displayName`, which is a plain
// text field not meant to carry a JSX line break or a brand hex color.
const PASS_PRESENTATION = {
    EARLY_BIRD: {
        name: (
            <>
                Early
                <br />
                Bird
            </>
        ),
        color: "#FF5634",
    },
    NORMAL: {
        name: (
            <>
                VIP
                <br />
                Pass
            </>
        ),
        color: "#1040F5",
    },
};

export function StoreNav() {
    return (
        <nav className="
                fixed z-50
                top-0 left-0
                w-full h-28
                px-12
                flex items-center justify-between"
        >
            <div
                className="flex items-center gap-2"
            >
                <img src="/images/OTG Purple.svg" alt="" width="90px"/>
                <div className="h-14 w-px bg-gray-300 mx-4" />
                <img src="/images/bees-black.svg" alt="" width="120px"/>
            </div>
            {/* Page title */}
            <h1 className="mt-5 font-perandory text-7xl uppercase text-black">
                Marketplace
            </h1>
        </nav>
    )
}


export default function StorePage() {
    const { user } = useOutletContext();

    const [ticketTypes, setTicketTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [buyingCode, setBuyingCode] = useState(null);
    const [buyError, setBuyError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await listTicketTypes();
                if (!cancelled) {
                    setTicketTypes(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoadingTypes(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleBuy(type) {
        setBuyError("");
        setBuyingCode(type.code);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error("Could not load the payment gateway. Check your connection and try again.");
            }

            // amountPaise/order_id/key all come from this trusted, server-computed
            // response - never from the ticket-types listing or anything read off this page.
            const order = await createOrder(type.code);

            const razorpay = new window.Razorpay({
                key: order.razorpayKeyId,
                amount: order.amountPaise,
                currency: order.currency,
                order_id: order.razorpayOrderId,
                name: "Off The Grid",
                description: type.displayName,
                prefill: {
                    email: user.email,
                    contact: user.phoneNumber,
                },
                theme: { color: PASS_PRESENTATION[type.code]?.color },
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        // Full reload, not client-side navigate: RequireCompleteProfile
                        // caches `user` and won't refetch on a same-parent sibling
                        // navigation, so Dashboard would still show stale paymentStatus.
                        window.location.href = "/dashboard";
                    } catch (err) {
                        setBuyError(err.message);
                    }
                },
                modal: {
                    ondismiss: () => {
                        // User closed the popup without paying - not an error.
                    },
                },
            });

            razorpay.on("payment.failed", (response) => {
                setBuyError(response.error?.description || "Payment failed. Please try again.");
            });

            razorpay.open();
        } catch (err) {
            setBuyError(err.message);
        } finally {
            setBuyingCode(null);
        }
    }

    return (
        <>
            <StoreNav />
            <main className="py-30 px-12 h-screen w-screen bg-[#F8FFF4]">

                {/* Inventory */}
                <section className="pt-10">

                    <h2
                        className=" tektur font-semibold text-5xl text-black mb-6"
                    >
                        Inventory
                    </h2>

                    {loadError && (
                        <p className="text-red-500 poppins-regular mb-4">{loadError}</p>
                    )}

                    {buyError && (
                        <p className="text-red-500 poppins-regular mb-4">{buyError}</p>
                    )}

                    {loadingTypes ? (
                        <p className="poppins-medium text-gray-500 text-xl">Loading passes…</p>
                    ) : (
                        <div className="flex flex-wrap gap-7">
                            {ticketTypes.map((type) => {
                                const presentation = PASS_PRESENTATION[type.code] ?? {
                                    name: type.displayName,
                                    color: "#333333",
                                };

                                return (
                                    <PassCard
                                        key={type.code}
                                        name={presentation.name}
                                        color={presentation.color}
                                        priceRupees={type.priceRupees}
                                        status={type.status}
                                        loading={buyingCode === type.code}
                                        onBuy={() => handleBuy(type)}
                                    />
                                );
                            })}
                        </div>
                    )}

                </section>

            </main>
        </>

    )
}
