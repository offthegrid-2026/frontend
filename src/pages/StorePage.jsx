import PassCard from "../components/PassCard";

const passes = [
    {
        id: 1,
        name: (
            <>
                Early
                <br />
                Bird
            </>
        ),
        color: "#FF5634",
        soldOut: true
    },
    {
        id: 2,
        name: (
            <>
                VIP
                <br />
                Pass
            </>
        ),
        color: "#1040F5",
        soldOut: false
    }
];

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
                <img src="/public/images/OTG Purple.svg" alt="" width="90px"/>
                <div className="h-14 w-px bg-gray-300 mx-4" />
                <img src="/public/images/bees-black.svg" alt="" width="120px"/>
            </div>
            {/* Page title */}
            <h1 className="mt-5 font-perandory text-7xl uppercase text-black">
                Marketplace
            </h1>
        </nav>
    )
}


export default function StorePage() {
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

                    <div className="flex flex-wrap gap-7">
                        {passes.map((pass) => (
                            <PassCard
                                key={pass.id}
                                name={pass.name}
                                color={pass.color}
                                soldOut={pass.soldOut}
                                onBuy={() => {
                                    console.log("Buying:", pass.id);
                                }}
                            />
                        ))}
                    </div>

                </section>

            </main>
        </>

    )
}