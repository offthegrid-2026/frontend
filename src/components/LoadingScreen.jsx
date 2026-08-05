import EyeSpinner from "./EyeSpinner";

export default function LoadingScreen() {
    return (
        <div className="h-screen w-screen bg-[#F8FFF4] flex items-center justify-center">
            <EyeSpinner size={140} />
        </div>
    );
}
