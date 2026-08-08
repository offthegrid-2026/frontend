// Lazily injects Razorpay's Checkout script, once. Cached via a shared
// promise so repeated "Buy Now" clicks don't reinject/reload it.
let razorpayScriptPromise = null;

export function loadRazorpayScript() {
    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    if (razorpayScriptPromise) {
        return razorpayScriptPromise;
    }

    razorpayScriptPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => {
            razorpayScriptPromise = null; // allow a retry on the next click
            resolve(false);
        };
        document.body.appendChild(script);
    });

    return razorpayScriptPromise;
}
