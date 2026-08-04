import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, X, LogOut, CircleHelp } from "lucide-react";
import { logout } from "../api/authApi";
import { clearToken } from "../lib/token";

export default function FloatingMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } catch {
            // Even if the server call fails (network issue, already-expired token),
            // the user still wants out — fall through and clear the session locally.
        } finally {
            clearToken();
            navigate("/", { replace: true });
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="flex flex-col items-end gap-3"
                    >

                        <motion.button
                            onClick={handleLogout}
                            variants={{
                                hidden: {
                                    y: 30,
                                    opacity: 0,
                                    scale: 0.6
                                },
                                visible: {
                                    y: 0,
                                    opacity: 1,
                                    scale: 1
                                }
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 28
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="
                                flex items-center gap-3
                                bg-red-500
                                px-5 py-3
                                rounded-full
                                shadow-xl
                                border-none
                                poppins-medium
                                text-white
                                cursor-pointer
                            "
                        >
                            <LogOut size={18} />
                            Logout
                        </motion.button>

                        <motion.button
                            variants={{
                                hidden: {
                                    y: 30,
                                    opacity: 0,
                                    scale: 0.6
                                },
                                visible: {
                                    y: 0,
                                    opacity: 1,
                                    scale: 1
                                }
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 28,
                                delay: 0.05
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="
                                flex items-center gap-3
                                bg-[#0040FF]
                                px-5 py-3
                                rounded-full
                                shadow-xl
                                border-none
                                poppins-medium
                                text-white
                                cursor-pointer
                            "
                        >
                            <CircleHelp size={18} />
                            Need Help
                        </motion.button>

                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    rotate: open ? 180 : 0
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                className="
                    h-12
                    w-12
                    rounded-full
                    bg-black
                    text-white
                    shadow-2xl
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                "
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={open ? "close" : "open"}
                        initial={{
                            rotate: -90,
                            opacity: 0,
                            scale: 0.5
                        }}
                        animate={{
                            rotate: 0,
                            opacity: 1,
                            scale: 1
                        }}
                        exit={{
                            rotate: 90,
                            opacity: 0,
                            scale: 0.5
                        }}
                        transition={{
                            duration: 0.2
                        }}
                    >
                        {open ? <X size={28} /> : <ArrowUp size={28} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>

        </div>
    );
}