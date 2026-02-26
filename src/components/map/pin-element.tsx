// IMPORTANT: Create a NEW element for every single marker

import { Status } from "./map";

type Color = "blue-500" | "green-500" | "purple-500" | "neutral-500" | "red-500"

export const PinElement = (status: Status, color: Color) => {
    const pinContainer = document.createElement("div");
    pinContainer.className = `relative bg-${color} flex items-center justify-center rounded-full border-2 border-white size-10 isolate`;

    const pulse = document.createElement("div");
    pulse.className = "absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75";

    const icon = document.createElement("img");
    icon.src = '/truck-delivery.svg';
    icon.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 size-6";

    if(status === "to-loading" || status === "on-route") {
        pinContainer.appendChild(pulse);
    }
    pinContainer.appendChild(icon);

    return pinContainer;
}