"use client"

import { useFormatter } from "next-intl"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useEffect, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client";

import { Map, Marker } from "@/components/map/map"

import { getLocation } from "@/lib/google";

interface MapViewProps {
    search?: string;
    filterBy?: string;
}

export function MapView({ search, filterBy }: MapViewProps) {
    return (
        <ErrorBoundary fallback={<div>Failed to load map</div>}>
            <Suspense fallback={<div>Loading map...</div>}>
                <div className="w-full h-full max-h-[50vh]">
                    <MapComponent search={search} filterBy={filterBy} />
                </div>
            </Suspense>
        </ErrorBoundary>
    )
}

function MapComponent({ search, filterBy }: MapViewProps) {
    const [markers, setMarkers] = useState<Marker[]>([])
    const f = useFormatter();
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.carrierMap.positions.queryOptions({
            search,
            filterBy: filterBy || "all"
        })
    )

    useEffect(() => {
        let cancelled = false;

        async function truckPosition() {
            try {
                const results = await Promise.all(
                    data
                        .filter(p => p.location.placeId && p.updatedAt && p.status)
                        .map(async (position) => {
                            const { location, status, updatedAt, truckInternalId, regPlate } = position;

                            const { placeId } = location;
                            const locationData = await getLocation(placeId);

                            if (locationData?.[0]) {
                                const firstResult = locationData[0];
                                return {
                                    id: truckInternalId || regPlate || "unknown",
                                    location: firstResult.address_components[firstResult.address_components.length - 3].short_name,
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

                const validMarkers = results.filter((m): m is Marker => m !== null);

                setMarkers(validMarkers);
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