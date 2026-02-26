"use client"

import { useFormatter } from "next-intl"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useEffect, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client";

import { Map, Marker } from "@/components/map/map"

import { getLocation } from "@/lib/google";

export default function MapView() {
    const [markers, setMarkers] = useState<Marker[]>([])
    const f = useFormatter();

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.map.positions.queryOptions()
    )

    useEffect(() => {
        // Guard clause: Ensure data exists before proceeding
        async function truckPosition() {
            try {
                // Call your utility function (ensure it's exported from a file)
                data.forEach(async (position) => {
                    const { location, status, updatedAt } = position

                    if (!location?.[0]?.placeId || !updatedAt || !status) return;
                    const { placeId } = location[0];

                    const locationData = await getLocation(placeId);

                    if (locationData && locationData[0]) {
                        const firstResult = locationData[0];

                        setMarkers(prev => [
                            ...prev,
                            {
                                location: firstResult.address_components[0].long_name,
                                lat: firstResult.geometry.location.lat,
                                lng: firstResult.geometry.location.lng,
                                updatedAt: f.relativeTime(updatedAt, new Date()),
                                status: status as Marker["status"] // Type assertion to match the expected status type
                            }
                        ]);
                    }
                })
            } catch (error) {
                console.error("Failed to fetch location:", error);
            }
        }

        truckPosition();
    }, [data, f]); // Dependencies ensure this runs when tracking data changes


    return (
        <ErrorBoundary fallback={<div>Failed to load map</div>}>
            <Suspense fallback={<div>Loading map...</div>}>
                <div className="w-full h-full max-h-[65vh]">
                    <Map markers={markers} />
                </div>
            </Suspense>
        </ErrorBoundary>
    )
}