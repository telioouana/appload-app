"use client"

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export interface Marker {
    location: string;
    lat: number;
    lng: number;
    updatedAt: string;
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
    // Keep track of markers to clean them up when the prop changes
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
                minZoom: 4,
                maxZoom: 15,
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
            const { LatLng, LatLngBounds } = await importLibrary("core");
            const { InfoWindow } = await importLibrary("maps");

            // Clean up old markers before adding new ones
            activeMarkers.current.forEach(m => m.map = null);
            activeMarkers.current = [];

            const infoWindow = new InfoWindow({
                minWidth: 200,
                maxWidth: 200,
                headerDisabled: true,
                disableAutoPan: true
            });

            const bounds = new LatLngBounds();

            markers.forEach((m) => {
                // IMPORTANT: Create a NEW element for every single marker
                const pinContainer = document.createElement("div");
                pinContainer.className = "relative bg-green-500 flex items-center justify-center rounded-full border-2 border-white size-10 isolate";

                const pulse = document.createElement("div");
                pulse.className = "absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75";

                const icon = document.createElement("img");
                icon.src = '/truck-delivery.svg';
                icon.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 size-6";

                pinContainer.appendChild(pulse);
                pinContainer.appendChild(icon);

                const marker = new AdvancedMarkerElement({
                    map: mapRef.current,
                    position: { lat: m.lat, lng: m.lng },
                    content: pinContainer
                });

                const content = document.createElement("div");
                content.className = "font-sans flex flex-col gap-2 p-1";

                const title = document.createElement("h3");
                title.className = "font-bold text-slate-500 uppercase text-xs tracking-wider";
                title.textContent = t("title");

                const body = document.createElement("div");
                const location = document.createElement("p");
                location.className = "font-semibold text-base text-slate-900 leading-tight";
                location.textContent = m.location;

                const updatedAt = document.createElement("p");
                updatedAt.className = "text-xs text-slate-500 italic mt-1";
                updatedAt.textContent = m.updatedAt;

                body.appendChild(location);
                body.appendChild(updatedAt);
                content.appendChild(title);
                content.appendChild(body);
                
                // Hover listeners
                pinContainer.addEventListener("mouseenter", () => {
                    infoWindow.setContent(content);
                    infoWindow.open(mapRef.current, marker);
                });

                pinContainer.addEventListener("mouseleave", () => {
                    infoWindow.close();
                });

                bounds.extend(new LatLng(m.lat, m.lng));
                activeMarkers.current.push(marker);
            });

            if (markers.length > 0) {
                mapRef.current?.fitBounds(bounds);
            }
        };

        updateMarkers();
    }, [markers, t]);

    return <div ref={ref} className="w-full h-full rounded-xl shadow-inner bg-slate-100" />;
}