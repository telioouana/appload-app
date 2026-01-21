"use client"

import useOnclickOutside from "react-cool-onclickoutside";

import { useEffect, useState } from "react";
import { IconMapPin } from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer"
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

import { autoComplete } from "@/lib/google";

export const LocationInput: ControlFunc<{
    setCountry?: (value: string) => void
    setPlaceId?: (value: string) => void
    setState?: (value: string) => void
}> = ({
    setCountry,
    setPlaceId,
    setState,
    ...props
}) => {
        const [places, setPlaces] = useState<PlaceAutocompleteResult[] | []>([])
        const [place, setPlace] = useState<string>("")

        // useEffect(() => {
        //     async function loadPlaces() {
        //         const suggestions = await autoComplete(place)

        //         setPlaces(suggestions ?? [])
        //     }

        //     loadPlaces()
        // }, [place])

        const debounced = useDebouncedCallback(async () => {
            const suggestions = await autoComplete(place)
            setPlaces(suggestions ?? [])
        }, { wait: 1500 })

        const ref = useOnclickOutside(() => {
            setPlaces([]);
            setPlace("");
        });

        return (
            <Base {...props}>
                {(field) => {
                    function handleChange(input: string) {
                        debounced()
                        setPlace(input)
                        field.onChange(input)
                    }

                    function handleSelect(suggestion: PlaceAutocompleteResult) {
                        field.onChange(suggestion.description)
                        const countryTerm = suggestion.terms[suggestion.terms.length - 1]
                        const stateTerm = suggestion.terms[suggestion.terms.length - 2]
                        if (countryTerm) setCountry?.(countryTerm.value)
                        if (stateTerm) setState?.(stateTerm.value)
                        setPlaceId?.(suggestion.place_id)
                        setPlaces([]);
                        setPlace("");
                    }

                    return (
                        <div className="flex flex-col w-full relative" ref={ref}>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    type="text"
                                    autoComplete="off"
                                    value={field.value ?? ""}
                                    disabled={props.isPending}
                                    placeholder={props.placeholder}
                                    onChange={(e) => handleChange(e.target.value)}
                                />

                                <InputGroupAddon>
                                    <InputGroupText><IconMapPin /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>

                            {places.length > 0 && (
                                <Command className="absolute top-10 z-20 h-auto max-h-60 overflow-y-scroll container-snap w-full rounded-sm mt-2 bg-popover text-popover-foreground shadow-md outline-none p-1">
                                    <CommandList>
                                        {places.map((suggestion, index) => (
                                            <CommandItem
                                                className=""
                                                key={index}
                                                value={suggestion.description}
                                                onSelect={() => handleSelect(suggestion)}
                                            >{suggestion.description}</CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            )}
                        </div>

                    )
                }}
            </Base>
        )
    }