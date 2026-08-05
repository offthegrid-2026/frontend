import { motion } from "motion/react";

const EYE_SWING = {
    x: [-127, 25, 25, -127, -127],
};

const EYE_SWING_TRANSITION = {
    duration: 2,
    times: [0, 0.25, 0.5, 0.75, 1],
    ease: [0.65, 0, 0.35, 1],
    repeat: Infinity,
};

// Just the animated eye icon, sizeable/colorable so it can drop into a full loading
// screen, a button, or anywhere else that needs a compact "working..." indicator.
export default function EyeSpinner({ size = 140, color = "#2B2B2B", glintColor = "#D9D9D9" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M256 104C112.739 104 0 165.411 0 255C0 344.589 112.739 406 256 406C399.261 406 512 344.589 512 255C512 165.411 399.261 104 256 104ZM255.753 336.979C154.093 336.862 87.6603 304.039 87.8121 252.405C87.9638 200.77 154.567 168.084 256.228 168.201C357.888 168.318 424.321 201.141 424.169 252.775C424.017 304.41 357.433 337.096 255.753 336.979Z"
                fill={color}
            />
            <motion.g animate={EYE_SWING} transition={EYE_SWING_TRANSITION}>
                <circle cx="318" cy="296" r="40" fill={glintColor} />
                <path
                    d="M312.531 342.052C359.273 338.911 394.671 297.385 391.617 249.302C388.562 201.219 348.194 164.806 301.452 167.948C254.71 171.089 219.312 212.615 222.366 260.698C225.42 308.781 265.789 345.194 312.531 342.052ZM333.379 270.885C342.674 270.26 350.717 277.5 351.324 287.081C351.931 296.663 344.893 304.917 335.579 305.542C326.284 306.166 318.241 298.926 317.634 289.345C317.027 279.763 324.064 271.509 333.379 270.885Z"
                    fill={color}
                />
            </motion.g>
        </svg>
    );
}
