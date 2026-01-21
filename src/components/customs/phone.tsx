"use client"

import Image from "next/image";
import { IconChevronDown, IconPhone } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

import { countryCodes } from "@/lib/country-codes";

export const PhoneInput: ControlFunc<{
    country: string
    setCountry: (country: string) => void
}> = ({
    country,
    setCountry,
    ...props
}) => {
        const selectedCountry = countryCodes.find((data) => data.country === country)

        return <Base {...props}>{field => (
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText><IconPhone /></InputGroupText>
                </InputGroupAddon>

                <InputGroupAddon>
                    <Popover>
                        <PopoverTrigger className="flex gap-2 items-center" disabled={props.isPending}>
                            <Image src={`/flags/${selectedCountry?.iso || "default"}.svg`} alt="flag" width={1} height={1} className="ml-2 size-4" preload />
                            <p className="text-muted-foreground">{selectedCountry?.code}</p>
                            <IconChevronDown className="size-4 opacity-50" />
                        </PopoverTrigger>
                        <PopoverContent align="start">
                            <Command>
                                <CommandInput />
                                <CommandEmpty></CommandEmpty>
                                <CommandList className="overflow-y-scroll container-snap h-60">{
                                    countryCodes.map(({ iso, code, country }, index) => {
                                        return (
                                            <CommandItem
                                                key={index}
                                                value={country}
                                                onSelect={() => {
                                                    setCountry(country)
                                                }}
                                            >
                                                <div className="flex w-full justify-evenly">
                                                    <div className="flex space-x-2 w-full items-center">
                                                        <Image src={`/flags/${iso}.svg`} alt="flag" width={1} height={1} className="flex w-3 h-2" preload />
                                                        <span>{country}</span>
                                                    </div>
                                                    <span className="text-muted-foreground font-medium w-fit text-nowrap justify-end">{code}</span>
                                                </div>
                                            </CommandItem>
                                        )
                                    })
                                }</CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </InputGroupAddon>

                <InputGroupInput
                    {...field}
                    type="tel"
                    autoComplete="off"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={props.isPending}
                    placeholder={countryCodes.find((data) => data.country === country)?.placeholder}
                />
            </InputGroup>
        )}</Base>
    }