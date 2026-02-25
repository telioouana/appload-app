"use client"

import { useFormatter } from "next-intl";
import { useState, useEffect } from "react"; // Added us☻eEffect

import { Map, Marker } from "@/components/map/map";

import { getLocation } from "@/lib/google";

import { Values } from "../../types/types"

export function TrackingOrderTab({ values }: { values: Values }) {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const f = useFormatter();

    const { tracking } = values;

    useEffect(() => {
        // Guard clause: Ensure data exists before proceeding
        const loc = tracking?.location?.[0];

        if (!loc?.placeId || !loc?.address || !tracking?.updatedAt) return;

        const { placeId } = loc
        const { updatedAt } = tracking

        async function truckPosition() {
            try {
                // Call your utility function (ensure it's exported from a file)
                const locationData = await getLocation(placeId);

                if (locationData && locationData[0]) {
                    const firstResult = locationData[0];

                    setMarkers([{
                        location: firstResult.address_components[0].long_name,
                        lat: firstResult.geometry.location.lat,
                        lng: firstResult.geometry.location.lng,
                        updatedAt: f.relativeTime(updatedAt, new Date()),
                    }]);
                }
            } catch (error) {
                console.error("Failed to fetch location:", error);
            }
        }

        truckPosition();
    }, [tracking, f]); // Dependencies ensure this runs when tracking data changes

    return (
        <div className="w-full h-[30vh] rounded-xl">
            <Map markers={markers} />
        </div>
    );
}