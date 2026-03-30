"use client"

import { z } from "zod"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconChecks, IconContract, IconX } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"
import { TRIP_STATUS } from "@/backend/db/types"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"
import { SelectInput } from "@/components/customs/select"
import { LocationInput } from "@/components/customs/location"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { manageTripSchema } from "../../../schemas/trip"
import { TRIPS_PATH, TripValues } from "../../../types/types"
import { useManageTrip } from "../../../hooks/use-manage-trip"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

export const TripSchema = manageTripSchema((k: string) => k)
export type TripSchemaForm = z.infer<typeof TripSchema>

export function ManageTripDialog({ path, search, cargoType }: { path: TRIPS_PATH, search?: string, cargoType?: string }) {
    const { isOpen, onClose, values } = useManageTrip()

    if (!values) return null

    return (
        <Render
            path={path}
            isOpen={isOpen}
            values={values}
            search={search}
            onClose={onClose}
            cargoType={cargoType}
        />
    )
}

function Render({ isOpen, onClose, path, values, search, cargoType }: { isOpen: boolean, onClose: () => void, path: TRIPS_PATH, values: TripValues, search?: string, cargoType?: string }) {
    const t = useTranslations("Carrier.trip.dialog.manage")

    const ManageSchema = useMemo(() => manageTripSchema(t), [t])
    type ManageForm = z.infer<typeof ManageSchema>

    const form = useForm<ManageForm>({
        resolver: zodResolver(ManageSchema),
        defaultValues: {
            tripId: values.trip.id,
            orderId: values.order.id,
            trackingId: values.tracking?.id,
            truckPlate: values.trip.truckPlate ?? "",
            status: values.trip.status as typeof TRIP_STATUS[number],
            location: values.tracking?.location ?? undefined,
        }
    })

    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const manage = useMutation(
        trpc.trips.manage.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.trips.all.infiniteQueryOptions({
                    path,
                    limit: DEFAULT_PAGE_LIMIT,
                    search: search?.trim() || undefined,
                    cargoType: cargoType?.trim() || undefined,
                }))
                queryClient.invalidateQueries(trpc.trips.resume.queryOptions({
                    path,
                    search: search?.trim() || undefined,
                    cargoType: cargoType?.trim() || undefined,
                }))
                handleClose()
            }
        })
    )

    function handleClose() {
        form.reset()
        onClose()
    }

    async function handleSubmit(values: ManageForm) {
        form.clearErrors()
        await manage.mutateAsync({ values })
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl max-h-[80vh]" >
                <DialogHeader className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconContract className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{t("header.title", { id: values.trip.legacyId.toString().padStart(4, "0") })}</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-0.5">{t("header.description")}</DialogDescription>
                        </div>
                    </div>

                    <DialogClose
                        onClick={handleClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-5 text-primary-foreground" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <FormProvider {...form} >
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex max-h-[50vh] px-6 pb-6 overflow-y-scroll container-snap">
                            <FieldGroup>
                                <SelectInput 
                                    control={form.control}
                                    name="status"
                                    label={t("form.status.label")}
                                    placeholder={t("form.status.placeholder")}
                                >
                                    {TRIP_STATUS.map((status) => (
                                        <SelectItem key={status} value={status} hidden={status === "booked" || status === "at-border" || status === "cancelled" || status === "completed" || status === "issue"}>
                                            {t(`form.status.options.${status}`)}
                                        </SelectItem>
                                    ))}
                                </SelectInput>
                                <LocationInput
                                    control={form.control}
                                    name="location.address"
                                    label={t("form.location.label")}
                                    placeholder={t("form.location.placeholder")}
                                    setCountry={(value) => form.setValue("location.country", value)}
                                    setPlaceId={(value) => form.setValue("location.placeId", value)}
                                    setState={(value) => form.setValue("location.state", value)}
                                />
                            </FieldGroup>
                        </div>

                        <DialogFooter className="flex justify-end items-center border-t p-6 gap-2">
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={manage.isPending || form.formState.isSubmitting}
                                >
                                    <IconX />
                                    {t("footer.close")}
                                </Button>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={manage.isPending || form.formState.isSubmitting}
                                >
                                    <IconChecks />
                                    {t("footer.update")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
