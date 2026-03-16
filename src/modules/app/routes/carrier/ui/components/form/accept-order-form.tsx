"use client"

import useOnclickOutside from "react-cool-onclickoutside"

import { useState } from "react"
import { withMask } from "use-mask-input"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { useDebouncedCallback } from "@tanstack/react-pacer"
import { IconArrowRight, IconBiohazard, IconMapPin, IconPackage, IconSnowflake, IconTruck } from "@tabler/icons-react"

import { SelectItem } from "@/components/ui/select"
import { TextInput } from "@/components/customs/text"
import { DateInput } from "@/components/customs/date"
import { Separator } from "@/components/ui/separator"
import { SelectInput } from "@/components/customs/select"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import { FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

import { TripSchemaForm } from "../dialog/accept-order-dialog"
import { Driver, Fleet, OrderValues } from "../../../types/types"

interface Props {
    values: OrderValues
}

export function AcceptOrderForm({ values }: Props) {
    const [drivers, setDrivers] = useState<Driver[] | []>([])
    const [fleet, setFleet] = useState<Fleet[] | []>([])
    const [driver, setDriver] = useState<string>("")
    const [plate, setPlate] = useState<string>("")

    const t = useTranslations("Carrier.order.dialog.accept.form")

    const { control, formState: { isSubmitting }, setValue } = useFormContext<TripSchemaForm>()

    const { cargo, drivers: driversList, fleet: fleetList, order } = values

    const debouncedDriver = useDebouncedCallback(() => {
        const data = driversList.filter((value) => value.name.toLowerCase().includes(driver.toLowerCase()))
        setDrivers(data ?? [])
    }, { wait: 500 })

    const normalizePlate = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "")
    const debouncedFleet = useDebouncedCallback((query: string) => {
        const normalizedQuery = normalizePlate(query)
        const data = fleetList.filter((value) =>
            normalizePlate(value.truck.regPlate).includes(normalizedQuery)
        )
        setFleet(data ?? [])
    }, { wait: 500 })

    const refDriver = useOnclickOutside(() => {
        setDriver("")
        setDrivers([])
    })

    const refFleet = useOnclickOutside(() => {
        setPlate("")
        setFleet([])
    })

    function handleChangeDriver(input: string) {
        setDriver(input)
        debouncedDriver()
    }

    function handleChangeFleet(input: string) {
        setPlate(input)
        debouncedFleet(input)
    }

    function handleSelectDriver(value: Driver) {
        setValue("driverId", value.id)
        setValue("driverName", value.name)
        setValue("driverPassport", value.passport ?? "")
        setValue("driverPhoneNumber", value.phone ?? "")

        setDriver("")
        setDrivers([])
    }

    function handleSelectFleet(value: Fleet) {
        setValue("truckPlate", value.truck.regPlate)
        const age = value.truck.year >= 2015 ? "recent" : "not-recent"
        setValue("truckAge", age)
        setValue("trailerPlate", value.trailer?.regPlate)
        setValue("linkPlate", value.link?.regPlate)

        setPlate("")
        setFleet([])
    }

    return (
        <FieldGroup>
            <FieldSet className="flex flex-col">
                <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                    <FieldLabel>{t("order.title")}</FieldLabel>
                    <Separator />
                </FieldLegend>

                <div className="flex flex-col gap-4 rounded-xl bg-muted p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                            <IconMapPin className="text-primary" stroke={1.5} />
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs text-muted-foreground">{t("order.fields.info.order.route")}</span>
                                <div className="flex gap-2 items-center">
                                    <span className="font-medium">{order.loadingAddress?.[0]?.state}</span>

                                    <IconArrowRight className="w-7 h-3" />

                                    <span className="font-medium">{order.offloadingAddress?.[0]?.state}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <IconPackage className="text-primary" stroke={1.5} />
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs text-muted-foreground">{t("order.fields.info.cargo.category.label")}</span>
                                <span className="font-medium">{t(`order.fields.info.cargo.category.${cargo.category}`)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cargo.isRefrigerated && (
                            <div className="flex items-start gap-2">
                                <IconSnowflake className="text-blue-500 size-5" stroke={1} />
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="bg-blue-50 w-fit text-blue-500 font-medium px-3 py-0.5 gap-1.5 inline-flex items-center rounded-sm border-none">
                                        {t("order.fields.info.cargo.refrigerated")}
                                    </div>

                                    <div className="flex flex-col font-medium">
                                        <span>{cargo.temperature}º C</span>
                                        <span>{cargo.temperatureInstructions}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {cargo.isHazardous && (
                            <div className="flex items-start gap-2">
                                <IconBiohazard className="text-amber-500 size-5" stroke={1} />
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="bg-amber-50 w-fit text-amber-500 font-medium px-3 py-0.5 gap-1.5 inline-flex items-center rounded-sm border-none">
                                        {t("order.fields.info.cargo.hazarduos")}
                                    </div>

                                    <span className="font-medium">{cargo.description}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <FieldSet>
                        <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                            <FieldLabel>{t("order.fields.dates.label")}</FieldLabel>
                            <FieldDescription>{t("order.fields.dates.description")}</FieldDescription>
                        </FieldLegend>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DateInput
                                control={control}
                                name="proposedLoadingDate"
                                label={t("order.fields.dates.proposed-loading-date.label")}
                                placeholder={t("order.fields.dates.proposed-loading-date.placeholder")}
                                isPending={isSubmitting}
                            />

                            <DateInput
                                control={control}
                                name="proposedOffloadingDate"
                                label={t("order.fields.dates.proposed-offloading-date.label")}
                                placeholder={t("order.fields.dates.proposed-offloading-date.placeholder")}
                                isPending={isSubmitting}
                            />
                        </div>
                    </FieldSet>
                </div>
            </FieldSet>

            <FieldSet className="flex flex-col">
                <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                    <FieldLabel>{t("fleet.title")}</FieldLabel>
                    <Separator />
                </FieldLegend>

                <FieldSet>
                    <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                        <FieldLabel>{t("fleet.search.label")}</FieldLabel>
                        <FieldDescription>{t("fleet.search.description")}</FieldDescription>
                    </FieldLegend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between items-center">
                        <div className="flex flex-col w-full relative gap-2" ref={refDriver}>
                            <FieldLabel>{t("fleet.search.driver.label")}</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    type="text"
                                    className="w-full"
                                    autoComplete="off"
                                    value={driver}
                                    disabled={false}
                                    placeholder={t("fleet.search.driver.placeholder")}
                                    onChange={(e) => handleChangeDriver(e.target.value)}
                                />

                                <InputGroupAddon>
                                    <InputGroupText><IconTruck /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>

                            {drivers.length > 0 && (
                                <Command className="absolute top-10 z-20 h-auto max-h-60 overflow-y-scroll container-snap w-full rounded-sm mt-2 bg-popover text-popover-foreground shadow-md outline-none p-1">
                                    <CommandList>
                                        {drivers.map((suggestion, index) => (
                                            <CommandItem
                                                key={index}
                                                className=""
                                                value={suggestion.name}
                                                onSelect={() => handleSelectDriver(suggestion)}
                                            >{suggestion.name}</CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            )}
                        </div>

                        <div className="flex flex-col w-full relative gap-2" ref={refFleet}>
                            <FieldLabel>{t("fleet.search.truck.label")}</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    type="text"
                                    className="w-full"
                                    autoComplete="off"
                                    value={plate}
                                    disabled={false}
                                    placeholder={t("fleet.search.truck.placeholder")}
                                    onChange={(e) => handleChangeFleet(e.target.value)}

                                    ref={withMask('AAA 999 AA', {
                                        placeholder: '_',
                                        showMaskOnHover: false,
                                        autoUnmask: true
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
                                                value={suggestion.truck.regPlate}
                                                onSelect={() => handleSelectFleet(suggestion)}
                                            >{suggestion.truck.regPlate}</CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            control={control}
                            name="driverName"
                            label={t("fields.name.label")}
                            placeholder={t("fields.name.placeholder")}
                            isPending
                        />

                        <TextInput
                            control={control}
                            name="driverPhoneNumber"
                            label={t("fields.phone-number.label")}
                            placeholder={t("fields.phone-number.placeholder")}
                            isPending
                        />

                        <TextInput
                            control={control}
                            name="driverPassport"
                            label={t("fields.passport.label")}
                            placeholder={t("fields.passport.placeholder")}
                            isPending
                        />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            control={control}
                            name="truckPlate"
                            label={t("fields.truck-plate.label")}
                            placeholder={t("fields.truck-plate.placeholder")}
                            isPending
                        />

                        <SelectInput
                            control={control}
                            name="truckAge"
                            label={t("fields.truck-age.label")}
                            placeholder={t("fields.truck-age.placeholder")}
                            isPending
                        >
                            <SelectItem value="recent">{t("fields.truck-age.value.recent")}</SelectItem>
                            <SelectItem value="not-recent">{t("fields.truck-age.value.not-recent")}</SelectItem>
                        </SelectInput>

                        <TextInput
                            control={control}
                            name="trailerPlate"
                            label={t("fields.trailer-plate.label")}
                            placeholder={t("fields.trailer-plate.placeholder")}
                            isPending
                        />

                        <TextInput
                            control={control}
                            name="linkPlate"
                            label={t("fields.link-plate.label")}
                            placeholder={t("fields.link-plate.placeholder")}
                            isPending
                        />
                    </div>

                </FieldSet>
            </FieldSet>
        </FieldGroup>
    )
}
