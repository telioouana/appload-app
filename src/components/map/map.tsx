"use client"

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { PinElement } from "./pin-element";

// Match the status union from your router
export type Status = 
  | "to-loading" | "at-loading" | "loading" | "on-route" 
  | "at-offloading" | "offloading" | "stopped" 
  | "waiting-documents" | "issue" | "at-border";

export interface Marker {
    id: string; // The truckInternalId or regPlate
    location: string;
    lat: number;
    lng: number;
    updatedAt: string;
    status: Status;
}

interface Props {
    markers?: Marker[];
}

setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
});

export function Map({ markers }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const activeMarkers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const t = useTranslations("Map.info-window");

    // Effect 1: Initialize the Map
    useEffect(() => {
        async function init() {
            if (!ref.current || mapRef.current) return;
            const { Map } = await importLibrary("maps");
            mapRef.current = new Map(ref.current, {
                center: { lat: -25.965, lng: 32.585 },
                zoom: 12,
                minZoom: 2, // Allow more zoom out for global shippers
                maxZoom: 18,
                disableDefaultUI: true,
                mapId: "d0cdfd1a53b2e2d9"
            });
        }
        init();
    }, []);

    // Effect 2: Update Markers
    useEffect(() => {
        if (!mapRef.current || !markers) return;

        const updateMarkers = async () => {
            const { AdvancedMarkerElement } = await importLibrary("marker");
            const { LatLngBounds } = await importLibrary("core");
            const { InfoWindow } = await importLibrary("maps");

            // Cleanup
            activeMarkers.current.forEach(m => m.map = null);
            activeMarkers.current = [];

            const infoWindow = new InfoWindow({
                minWidth: 200,
                maxWidth: 200,
                headerDisabled: true,
            });

            const bounds = new LatLngBounds();

            markers.forEach((m) => {
                // Color logic based on your updated statuses
                const color =
                    m.status === "at-loading" || m.status === "loading" ? "bg-blue-500" :
                    m.status === "to-loading" || m.status === "on-route" || m.status === "at-border" ? "bg-green-500" :
                    m.status === "at-offloading" || m.status === "offloading" ? "bg-purple-500" :
                    m.status === "stopped" || m.status === "waiting-documents" ? "bg-neutral-500" : "bg-red-500";

                const pinContainer = PinElement(m.status, color);

                const marker = new AdvancedMarkerElement({
                    map: mapRef.current,
                    position: { lat: m.lat, lng: m.lng },
                    content: pinContainer,
                    title: m.id // Useful for accessibility/hover
                });

                // Window Content
                const content = document.createElement("div");
                content.className = "font-sans flex flex-col gap-1 p-1";

                const title = document.createElement("h5");
                title.className = "font-bold text-slate-400 uppercase text-[10px] tracking-widest";
                // Show the Truck ID/Plate in the header
                title.textContent = m.id; 

                const location = document.createElement("p");
                location.className = "font-semibold text-sm text-slate-900 leading-tight";
                location.textContent = m.location;

                const updatedAt = document.createElement("p");
                updatedAt.className = "text-[10px] text-slate-500 italic mt-1";
                updatedAt.textContent = m.updatedAt;

                content.append(title, location, updatedAt);

                // Interactions
                pinContainer.addEventListener("mouseenter", () => {
                    infoWindow.setContent(content);
                    infoWindow.open(mapRef.current, marker);
                });

                pinContainer.addEventListener("mouseleave", () => {
                    infoWindow.close();
                });

                bounds.extend({ lat: m.lat, lng: m.lng });
                activeMarkers.current.push(marker);
            });

            // Adjust viewport
            if (markers.length > 0) {
                mapRef.current?.fitBounds(bounds);
                
                // If there's only one marker (e.g. searching for specific plate), 
                // don't zoom in so far that we only see a roof.
                if (markers.length === 1) {
                    const listener = google.maps.event.addListener(mapRef.current!, "idle", () => {
                        if (mapRef.current!.getZoom()! > 15) mapRef.current!.setZoom(15);
                        google.maps.event.removeListener(listener);
                    });
                }
            }
        };

        updateMarkers();
    }, [markers, t]);

    return <div ref={ref} className="w-full h-full rounded-xl shadow-inner bg-slate-100" />;
}