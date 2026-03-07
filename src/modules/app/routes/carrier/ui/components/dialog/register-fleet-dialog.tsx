"use client"

import { z } from "zod"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowRight, IconPlus, IconTruck, IconX } from "@tabler/icons-react"
import { FormProvider, useForm, DefaultValues, FieldPath } from "react-hook-form"

import { LOADING_BAY, TRUCK_TYPE } from "@/backend/db/types"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { RegisterTruckForm } from "../form/register-truck-form"
import { useRegisterFleet } from "../../../hooks/use-register-fleet"
import { RegisterTrailerForm } from "../form/register-trailer-form"

export function DynamicFleetSchema(hasTrailer: boolean, hasLink: boolean, t: (key: string) => string) {
    const LoadingBaySchema = z.object({
        width: z.number({ error: t("form.loading-bay.width.error") }).positive({ error: t("form.loading-bay.width.error") }),
        length: z.number({ error: t("form.loading-bay.length.error") }).positive({ error: t("form.loading-bay.length.error") }),
        height: z.number({ error: t("form.loading-bay.height.error") }).positive({ error: t("form.loading-bay.height.error") }),
        volume: z.number({ error: t("form.loading-bay.volume.error") }).positive({ error: t("form.loading-bay.volume.error") }),
        capacity: z.number({ error: t("form.loading-bay.capacity.error") }).positive({ error: t("form.loading-bay.capacity.error") }),
        type: z.enum(LOADING_BAY, { error: t("form.loading-bay.type.error") })
    })

    const TruckFields = z.object({
        internalId: z.string().optional(),
        driver: z.string().optional(),
        regPlate: z.string({ error: t("form.truck.plate-number.error") }).nonempty({ error: t("form.truck.plate-number.error") }),
        brand: z.string({ error: t("form.truck.brand.error") }).nonempty({ error: t("form.truck.brand.error") }),
        model: z.string({ error: t("form.truck.model.error") }).nonempty({ error: t("form.truck.model.error") }),
        year: z.string({ error: t("form.truck.year.error") }).nonempty({ error: t("form.truck.year.error") }),
        type: z.enum(TRUCK_TYPE),
        vin: z.string({ error: t("form.truck.vin.error.empty") }).nonempty({ error: t("form.truck.vin.error.empty") }).length(17, { error: t("form.truck.vin.error.invalid") }),
        booklet: z.array(z.object({ url: z.url({ error: t("form.truck.license.error.empty") }) })).min(1, { error: t("form.truck.license.error.invalid") }),
        license: z.array(z.object({ url: z.url({ error: t("form.truck.booklet.error.empty") }) })).min(1, { error: t("form.truck.booklet.error.invalid") }),
    })

    const TruckSchema = z.discriminatedUnion("type", [
        TruckFields.extend({
            type: z.literal("non-articulated"),
            loadingBay: LoadingBaySchema, // REQUIRED
        }),
        TruckFields.extend({
            type: z.literal("articulated"),
            loadingBay: z.object({
                width: z.number().positive().optional(),
                length: z.number().positive().optional(),
                height: z.number().positive().optional(),
                volume: z.number().positive().optional(),
                capacity: z.number().positive().optional(),
                type: z.enum(LOADING_BAY).optional()
            }),
        }),
    ]);

    const TrailerSchema = z.object({
        internalId: z.string().optional(),
        regPlate: z.string({ error: t("form.trailer.plate-number.error") }).nonempty({ error: t("form.trailer.plate-number.error") }),
        brand: z.string({ error: t("form.trailer.brand.error") }).nonempty({ error: t("form.trailer.brand.error") }),
        model: z.string({ error: t("form.trailer.model.error") }).nonempty({ error: t("form.trailer.model.error") }),
        year: z.string({ error: t("form.trailer.year.error") }).nonempty({ error: t("form.trailer.year.error") }),
        loadingBay: LoadingBaySchema,
        vin: z.string({ error: t("form.trailer.vin.error.empty") }).nonempty({ error: t("form.trailer.vin.error.empty") }).length(17, { error: t("form.trailer.vin.error.invalid") }),
        booklet: z.array(z.object({ url: z.url({ error: t("form.trailer.license.error.empty") }) })).min(1, { error: t("form.trailer.license.error.invalid") }),
        license: z.array(z.object({ url: z.url({ error: t("form.trailer.booklet.error.empty") }) })).min(1, { error: t("form.trailer.booklet.error.invalid") }),
    })

    let fleetSchema = z.object({
        truck: TruckSchema
    });

    if (hasTrailer) {
        fleetSchema = fleetSchema.extend({
            trailer: TrailerSchema
        });

        if (hasLink) {
            fleetSchema = fleetSchema.extend({
                link: TrailerSchema // Reusing TrailerSchema since the fields are identical
            });
        }
    }

    return fleetSchema;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BaseSchema = DynamicFleetSchema(true, true, (k: string) => k);
export type FullFleetForm = z.infer<typeof BaseSchema>

export function RegisterFleetDialog() {
    const [hasTrailer, setHasTrailer] = useState<boolean>(false)
    const [hasLink, setHasLink] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0); // 0: Truck, 1: Trailer, 2: Link

    const t = useTranslations("Carrier.company.fleet.dialog")
    const { isOpen, onClose } = useRegisterFleet()

    // Memorizing the schema to keep it in sync with state
    const registerFleetSchema = useMemo(
        () => DynamicFleetSchema(hasTrailer, hasLink, t),
        [hasTrailer, hasLink, t]
    );

    const form = useForm<FullFleetForm>({
        resolver: zodResolver(registerFleetSchema) as import("react-hook-form").Resolver<FullFleetForm>,
        defaultValues: {
            truck: { license: [{ url: "" }], booklet: [{ url: "" }] },
            trailer: { license: [{ url: "" }], booklet: [{ url: "" }] },
            link: { license: [{ url: "" }], booklet: [{ url: "" }] }
        } as DefaultValues<FullFleetForm>
    });

    async function handleNext() {
        form.clearErrors()
        const paths = ["truck", "trailer", "link"] as const;
        const currentPath = paths[step] as keyof FullFleetForm;

        const fields: FieldPath<FullFleetForm>[] = [
            `${currentPath}.regPlate`,
            `${currentPath}.brand`,
            `${currentPath}.model`,
            `${currentPath}.year`,
            `${currentPath}.type`,
            `${currentPath}.vin`,
            `${currentPath}.loadingBay.width`,
            `${currentPath}.loadingBay.length`,
            `${currentPath}.loadingBay.height`,
            `${currentPath}.loadingBay.volume`,
            `${currentPath}.loadingBay.capacity`,
            `${currentPath}.loadingBay.type`,
            `${currentPath}.booklet`,
            `${currentPath}.license`,
        ]

        const isValid = await form.trigger(fields, { shouldFocus: true });
        if (isValid) setStep((s) => s + 1);
        return isValid
    };

    async function addLink() {
        const isValid = await handleNext()
        setHasLink(isValid);
    };

    function handleClose() {
        form.reset()
        onClose()
    }

    function handleSubmit(values: FullFleetForm) {
        form.clearErrors()
        window.alert(values)
    }

    function removeTrailer() {
        setHasTrailer(false);
        setHasLink(false);
        setStep(0);

        const values = form.getValues();
        const next = { ...values } as Record<string, unknown>
        delete next["trailer"]
        delete next["link"]

        form.reset(next as DefaultValues<FullFleetForm>)
    };

    function removeLink() {
        setHasLink(false);
        setStep(1);

        // Clear conditional fields in a typed-safe way (no `any`)
        const values = form.getValues();
        const next = { ...values } as Record<string, unknown>
        delete next["link"]

        form.reset(next as DefaultValues<FullFleetForm>)
    };


    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl gap-0 flex flex-col max-h-9/12">
                <DialogHeader className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconTruck className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{t("register.header.title")}</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-0.5">{t("register.header.description")}</DialogDescription>
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

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="max-h-[50vh] overflow-y-auto p-6 container-snap">
                            {/* Step-based Rendering */}
                            {step === 0 && <RegisterTruckForm setHasTrailer={setHasTrailer} />}
                            {step === 1 && hasTrailer && <RegisterTrailerForm name="trailer" hasLink={hasLink} addLink={addLink} remove={removeTrailer} />}
                            {step === 2 && hasLink && <RegisterTrailerForm name="link" remove={removeLink} />}
                        </div>

                        <DialogFooter className="p-6 border-t flex justify-end gap-4 w-full items-center">
                            {step > 0
                                ? (
                                    <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>
                                        {t("register.footer.back")}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                    >
                                        {t("register.footer.cancel")}
                                    </Button>
                                )
                            }

                            <div className="flex gap-2">
                                {((step === 0 && hasTrailer) || (step === 1 && hasLink)) ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={step === 0 && form.watch("truck.type") === undefined}
                                    >
                                        {t("register.footer.next")}
                                        <IconArrowRight />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={step === 0 && form.watch("truck.type") === undefined}
                                    >
                                        {t("register.footer.register")}
                                        <IconPlus />
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
