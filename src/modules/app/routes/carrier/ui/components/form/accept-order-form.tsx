"use client"

import useOnclickOutside from "react-cool-onclickoutside"

import { useState } from "react"
import { withMask } from "use-mask-input"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { useDebouncedCallback } from "@tanstack/react-pacer"

import { Separator } from "@/components/ui/separator"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import { FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

import { Fleet, Values } from "../../../types/types"
import { TripSchemaForm } from "../dialog/accept-order-dialog"
import { IconTruck } from "@tabler/icons-react"

interface Props {
    values: Values
}

export function AcceptOrderForm({ values }: Props) {
    const [fleet, setFleet] = useState<Fleet[] | []>([])
    const [plate, setPlate] = useState<string>("")

    const t = useTranslations("Carrier.order.dialog.accept.form")
    const { } = useFormContext<TripSchemaForm>()

    const { fleet: list } = values

    const debounced = useDebouncedCallback(() => {
        const data = list.filter((value) => value.truck.plate.includes(plate))
        setFleet(data ?? [])
    }, { wait: 500 })

    const ref = useOnclickOutside(() => {
        setPlate("")
        setFleet([])
    })
    function handleChange(input: string) {
        debounced()
        setPlate(input)
    }

    function handleSelect(value: Fleet) {
        
    }

    return (
        <FieldGroup>
            <FieldSet className="flex flex-col">
                <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                    <FieldLabel>{t("order.label")}</FieldLabel>
                    <Separator />
                </FieldLegend>

                <div className="flex flex-col gap-4 rounded-xl bg-muted p-4">

                </div>
            </FieldSet>

            <FieldSet className="flex flex-col mb-2">
                <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                    <FieldLabel>{t("fleet.section.title")}</FieldLabel>
                    <Separator />
                </FieldLegend>

                <FieldSet>
                    <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                        <FieldLabel>{t("fleet.label")}</FieldLabel>
                        <FieldDescription></FieldDescription>
                    </FieldLegend>

                    <div className="flex flex-col w-full relative" ref={ref}>
                        <InputGroup>
                            <InputGroupInput
                                type="text"
                                className="w-full"
                                autoComplete="off"
                                value={plate}
                                disabled={false}
                                placeholder={""}
                                onChange={(e) => handleChange(e.target.value)}

                                ref={withMask('AAA 999 AA', {
                                    placeholder: '_',
                                    showMaskOnHover: false
                                })}
                            />

                            <InputGroupAddon>
                                <InputGroupText><IconTruck /></InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>

                        {fleet.length > 0 && (
                            <Command className="absolute top-10 z-20 h-auto max-h-60 overflow-y-scroll container-snap w-full rounded-sm mt-2 bg-popover text-popover-foreground shadow-md outline-none p-1">
                                <CommandList>
                                    {fleet.map((suggestion, index) => (
                                        <CommandItem
                                            key={index}
                                            className=""
                                            value={suggestion.truck.plate}
                                            onSelect={() => handleSelect(suggestion)}
                                        >{suggestion.truck.plate}</CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        )}
                    </div>
                </FieldSet>
                
                <FieldSet>

                </FieldSet>
            </FieldSet>
        </FieldGroup>
    )
}
