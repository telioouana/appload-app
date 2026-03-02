"use client"

import { useFormatter } from "next-intl"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useEffect, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client";

import { Map, Marker } from "@/components/map/map"

import { getLocation } from "@/lib/google";

export function MapView() {
    return (
        <ErrorBoundary fallback={<div>Failed to load map</div>}>
            <Suspense fallback={<div>Loading map...</div>}>
                <div className="w-full h-full max-h-[65vh]">
                    <MapComponent />
                </div>
            </Suspense>
        </ErrorBoundary>
    )
}

function MapComponent() {
    const [markers, setMarkers] = useState<Marker[]>([])
    const f = useFormatter();
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.shipperMap.positions.queryOptions()
    )

    useEffect(() => {
        let cancelled = false;
        // Guard clause: Ensure data exists before proceeding
        async function truckPosition() {
            try {
                // Call your utility function (ensure it's exported from a file)
                const newMarkers = await Promise.all(
                    data
                        .filter(p => p.location?.[0]?.placeId && p.updatedAt && p.status)
                        .map(async (position) => {
                            const { location, status, updatedAt } = position;

                            if (!location || location.length === 0) return null; // Skip if no location data

                            const { placeId } = location[0];
                            const locationData = await getLocation(placeId);

                            if (locationData?.[0]) {
                                const firstResult = locationData[0];
                                return {
                                    location: firstResult.address_components[0].long_name,
                                    lat: firstResult.geometry.location.lat,
                                    lng: firstResult.geometry.location.lng,
                                    updatedAt: f.relativeTime(updatedAt, new Date()),
                                    status: status as Marker["status"]
                                };
                            }
                            return null;
                        })
                );
                if (cancelled) return;
                setMarkers(newMarkers.filter((m): m is Marker => m !== null));
            } catch (error) {
                if (cancelled) return;
                console.error("Failed to fetch location:", error);
            }
        }

        truckPosition();
        return () => { cancelled = true; };
    }, [data, f]);

    return <Map markers={markers} />;
}