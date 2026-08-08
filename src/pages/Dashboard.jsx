import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import DashboardField from "../components/DashboardField";
import FloatingMenu from "../components/FloatingMenu.jsx";
import EyeSpinner from "../components/EyeSpinner";
import { downloadTicketPdf } from "../api/ticketsApi";

export default function Dashboard() {
    const { user } = useOutletContext();
    const navigate = useNavigate();

    const [fetchingPass, setFetchingPass] = useState(false);
    const [passError, setPassError] = useState("");

    async function handleGetPass() {
        setFetchingPass(true);
        setPassError("");
        try {
            await downloadTicketPdf();
        } catch (err) {
            setPassError(err.message);
        } finally {
            setFetchingPass(false);
        }
    }

    return (
        <>
            <FloatingMenu />
            <section className="h-screen w-screen bg-[#F8FFF4]">

                <div id="Container" className="flex gap-20 justify-center items-center h-full w-full px-10 py-10 select-none">

                    <div id="Details" className="flex flex-col gap-5">

                        <div id="Heading">
                            <h1
                                className="text-black text-7xl uppercase font-perandory"
                            >
                                Hey <span className="text-[#FF5634]">{user.firstName},</span>
                            </h1>
                            <h2
                                className="text-black text-7xl uppercase font-perandory"
                            >
                                <span className="text-[#0040FF]">OFF THE GRID</span> AWAITS YOU!
                            </h2>
                        </div>

                        <div id="Personal Details">
                            <h3
                                className="text-black text-3xl tektur font-semibold"
                            >
                                Personal Details
                            </h3>
                            <div id="row-1" className="mt-5 w-full flex flex-col gap-1">

                                <div className="flex gap-2">

                                    <DashboardField
                                        label="First Name"
                                        value={user.firstName}
                                        className="flex-1"
                                    />
                                    <DashboardField
                                        label="Last Name"
                                        value={user.lastName}
                                        className="flex-1"
                                    />

                                </div>

                                <div id="row-2" className="flex flex-col md:flex-row gap-1 md:gap-2">

                                    <DashboardField
                                        label="Email"
                                        value={user.email}
                                        className="flex-2"
                                    />
                                    <DashboardField
                                        label="Phone"
                                        value={`+91 ${user.phoneNumber}`}
                                        className="flex-1"
                                    />

                                </div>

                                <div id="row-3" className="flex flex-col md:flex-row gap-1 md:gap-2">

                                    <DashboardField
                                        label="College/Organisation"
                                        value={user.collegeOrOrg}
                                        className="flex-1"
                                    />
                                    <DashboardField
                                        label="City, State"
                                        value={user.cityState}
                                        className="flex-1"
                                    />

                                </div>

                            </div>

                        </div>

                        <div id="Event Pass Details">
                            <h3
                                className="text-black text-3xl tektur font-semibold"
                            >
                                Event Pass Details
                            </h3>
                            <div className="mt-5 w-full border border-gray-400 bg-white p-3">
                                {user.paymentStatus ? (
                                    // TODO: swap in the real Event Pass card design once it's ready.
                                    // Structure is ready to branch on user.paymentStatus — no rewiring needed later.
                                    <div className="h-40 flex flex-col items-center justify-center gap-3">
                                        <p className="poppins-medium text-gray-500 text-xl">
                                            Here is your pass
                                        </p>

                                        <button
                                            disabled={fetchingPass}
                                            onClick={handleGetPass}
                                            className="bg-[#FF5634] text-white tektur font-semibold text-2xl px-6 py-2 cursor-pointer
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            hover:scale-102 active:scale-98
                                            transition-all ease-in-out duration-200
                                            flex items-center justify-center"
                                        >
                                            {fetchingPass ? <EyeSpinner size={32} color="#F0F0F0" glintColor="#555555" /> : "Get Pass"}
                                        </button>

                                        {passError && (
                                            <p className="text-[12px] text-red-500 poppins-regular">
                                                {passError}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-300 h-40 flex flex-col items-center justify-center gap-3"
                                    >
                                        <p className="poppins-medium text-gray-500 text-xl">
                                            Oops. No passes here...
                                        </p>

                                        <button
                                            onClick={() => navigate("/store")}
                                            className="bg-[#FF5634] text-white tektur font-semibold text-2xl px-6 py-2 cursor-pointer
                                            hover:scale-102 active:scale-98
                                            transition-all ease-in-out duration-200"
                                        >
                                            Buy a Pass
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div id="Image" className="lg:flex hidden">

                        <img
                            src="/public/images/dash-image.png"
                            alt=""
                            draggable="false"
                            className="w-150 opacity-90 "

                        />
                    </div>

                </div>

            </section>
        </>
    )
}
