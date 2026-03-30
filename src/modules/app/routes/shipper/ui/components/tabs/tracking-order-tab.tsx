"use client"

import { useFormatter } from "next-intl";
import { useState, useEffect } from "react"; // Added us☻eEffect

import { Map, Marker } from "@/components/map/map";

import { getLocation } from "@/lib/google";

import { Values } from "../../../types/types"

export function TrackingOrderTab({ values }: { values: Values }) {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const f = useFormatter();

    const { order, trip, tracking } = values;

    useEffect(() => {
        // Guard clause: Ensure data exists before proceeding
        if (order.status === "on-going") {
            const loc = tracking?.location;

            if (!loc?.placeId || !tracking?.updatedAt || !trip?.status) return;

            const { status } = trip
            const { placeId } = loc
            const { updatedAt } = tracking

            async function truckPosition() {
                try {
                    // Call your utility function (ensure it's exported from a file)
                    const locationData = await getLocation(placeId);

                    if (locationData && locationData[0]) {
                        const firstResult = locationData[0];

                        setMarkers(prev => [
                            ...prev,
                            {
                                id: trip?.truckPlate || "unknown",
                                location: firstResult.address_components[firstResult.address_components.length - 2].long_name,
                                lat: firstResult.geometry.location.lat,
                                lng: firstResult.geometry.location.lng,
                                updatedAt: f.relativeTime(updatedAt, new Date()),
                                status: status as Marker["status"] // Type assertion to match the expected status type
                            }
                        ]);
                    }
                } catch (error) {
                    console.error("Failed to fetch location:", error);
                }
            }

            truckPosition();
        }
    }, [tracking, f, trip, order]);

    return (
        <div className="w-full h-[30vh] rounded-xl">
            <Map markers={markers} />
        </div>
    );
}