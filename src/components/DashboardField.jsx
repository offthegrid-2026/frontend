export default function DashboardField({
    label,
    value,
    className = "",
}) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-sm poppins-light text-gray-500">
                {label}
            </label>

            <div
                className="
                h-12
                border
                border-gray-500
                bg-white
                px-4
                flex
                items-center
                poppins-regular
                text-md
            "
            >
                {value}
            </div>
        </div>
    );
}