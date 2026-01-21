"use server"

import { getLocale } from "next-intl/server"
import { Client, TravelMode, UnitSystem } from "@googlemaps/google-maps-services-js"

const client = new Client()

export async function autoComplete(input: string) {
    const locale = await getLocale()
    if (!input) return []

    try {
        const response = await client.placeAutocomplete({
            params: {
                input,
                key: process.env.GOOGLE_MAPS_API_KEY!,
                language: locale
            }
        })

        return response.data.predictions
    } catch (error) {
        console.log(error)
    }
}

export async function distanceCalculator(origins: string, destinations: string) {
    const locale = await getLocale()
    try {
        const response = await client.distancematrix({
            params: {
                origins: [`place_id:${origins}`],
                destinations: [`place_id:${destinations}`],
                mode: TravelMode.driving,
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!,
                language: locale,
                units: UnitSystem.metric
            }
        })

        return response.data.rows
    } catch (error) {
        console.log(error)
    }
}