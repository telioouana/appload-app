"use client"

import { z } from "zod"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconChecks, IconContract, IconX } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"
import { CURRENCY, FISCAL_REGIME, TRIP_TYPE, WEIGHT_UNIT } from "@/backend/db/types"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { manageTripSchema } from "../../../schemas/trip"
import { TRIPS_PATH, TripValues } from "../../../types/types"

import { DEFAULT_PAGE_LIMIT } from "@/constants"
import { useManageTrip } from "../../../hooks/use-manage-trip"

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

    const TripSchema = useMemo(() => manageTripSchema(t), [t])
    type TripSchemaForm = z.infer<typeof TripSchema>

    const form = useForm<TripSchemaForm>({
        resolver: zodResolver(TripSchema),
        defaultValues: {
            tripId: values.trip.id,
        }
    })

    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const accept = useMutation(
        trpc.orders.accept.mutationOptions({
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

    async function handleSubmit(values: TripSchemaForm) {
        form.clearErrors()
        
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
                            <DialogTitle className="text-xl font-semibold">{t("header.title")}</DialogTitle>
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

                        </div>

                        <DialogFooter className="flex justify-end items-center border-t p-6 gap-2">
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={accept.isPending || form.formState.isSubmitting}
                                >
                                    <IconX />
                                    {t("footer.close")}
                                </Button>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={accept.isPending || form.formState.isSubmitting}
                                >
                                    <IconChecks />
                                    {t("footer.accept")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
