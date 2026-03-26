"use client"

import { z } from "zod"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowRight, IconPlus, IconTruck, IconX } from "@tabler/icons-react"
import { FormProvider, useForm, DefaultValues, FieldPath } from "react-hook-form"

import { useTRPC } from "@/backend/trpc/client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { DynamicFleetSchema } from "../../../schemas/fleet"
import { RegisterTruckForm } from "../form/register-truck-form"
import { useRegisterFleet } from "../../../hooks/use-register-fleet"
import { RegisterTrailerForm } from "../form/register-trailer-form"

import { useEdgeStore } from "@/lib/edgestore"
import { DEFAULT_PAGE_LIMIT } from "@/constants"

export const BaseSchema = DynamicFleetSchema(true, true, (k: string) => k);
export type FullFleetForm = z.infer<typeof BaseSchema>

export function RegisterFleetDialog() {
    const [hasTrailer, setHasTrailer] = useState<boolean>(false)
    const [hasLink, setHasLink] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0); // 0: Truck, 1: Trailer, 2: Link

    const t = useTranslations("Carrier.company.fleet.dialog")
    const { isOpen, onClose } = useRegisterFleet()
    const queryClient = useQueryClient()
    const { edgestore } = useEdgeStore()
    const trpc = useTRPC()

    const save = useMutation(
        trpc.fleet.add.mutationOptions({
            onSuccess: async () => {
                const truck = form.getValues().truck
                const trailer = form.getValues().trailer
                const link = form.getValues().link

                const uploads = [
                    ...truck.booklet.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                    ...truck.license.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                ]

                if (hasTrailer && trailer) {
                    uploads.push(
                        ...trailer.booklet.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                        ...trailer.license.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                    )
                    if (hasLink && link) {
                        uploads.push(
                            ...link.booklet.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                            ...link.license.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                        )
                    }
                }

                await Promise.all(uploads)

                queryClient.invalidateQueries(
                    trpc.fleet.fleet.infiniteQueryOptions({
                        limit: DEFAULT_PAGE_LIMIT
                    })
                )
                queryClient.invalidateQueries(
                    trpc.fleet.resume.queryOptions()
                )
                handleClose()
            },
            onError: (error) => {
                // TODO: Display proper message with internationalization
                console.log(error)
            }
        })
    )

    // Memorizing the schema to keep it in sync with state
    const registerFleetSchema = useMemo(
        () => DynamicFleetSchema(hasTrailer, hasLink, t),
        [hasTrailer, hasLink, t]
    );

    const form = useForm<FullFleetForm>({
        resolver: zodResolver(registerFleetSchema) as import("react-hook-form").Resolver<FullFleetForm>,
        defaultValues: {
            truck: { license: [{ url: "" }], booklet: [{ url: "" }] },
            ...(hasTrailer && { trailer: { license: [{ url: "" }], booklet: [{ url: "" }] } }),
            ...(hasTrailer && hasLink && { link: { license: [{ url: "" }], booklet: [{ url: "" }] } }),
        } as DefaultValues<FullFleetForm>
    });

    useEffect(() => {
        // Initialize trailer if we just entered step 1 and it's not already set
        if (step === 1 && hasTrailer && !form.getValues("trailer")) {
            form.setValue("trailer.license", [{ url: "" }]);
            form.setValue("trailer.booklet", [{ url: "" }]);
        }

        // Initialize link if we just entered step 2 and it's not already set
        if (step === 2 && hasLink && !form.getValues("link")) {
            form.setValue("link.license", [{ url: "" }]);
            form.setValue("link.booklet", [{ url: "" }]);
        }
    }, [step, hasTrailer, hasLink, form]);

    async function handleNext() {
        form.clearErrors()
        const paths = ["truck", "trailer", "link"] as const;
        const currentPath = paths[step] as keyof FullFleetForm;

        const fields: FieldPath<FullFleetForm>[] = [
            `${currentPath}.regPlate`,
            `${currentPath}.brand`,
            `${currentPath}.model`,
            `${currentPath}.year`,
            `${currentPath}.vin`,
            `${currentPath}.booklet`,
            `${currentPath}.license`,
        ]

        if (step !== 0) {
            fields.push(
                `${currentPath}.loadingBay.width`,
                `${currentPath}.loadingBay.length`,
                `${currentPath}.loadingBay.height`,
                `${currentPath}.loadingBay.volume`,
                `${currentPath}.loadingBay.capacity`,
                `${currentPath}.loadingBay.type`,
            )
        }

        console.log(form.getValues())
        const isValid = await form.trigger(fields, { shouldFocus: true });
        if (isValid) {
            // 2. Initialize the NEXT step data before moving there
            const nextStep = step + 1;
            if (nextStep === 1 && hasTrailer && !form.getValues("trailer")) {
                form.setValue("trailer.license", [{ url: "" }]);
                form.setValue("trailer.booklet", [{ url: "" }]);
            }
            if (nextStep === 2 && hasLink && !form.getValues("link")) {
                form.setValue("link.license", [{ url: "" }]);
                form.setValue("link.booklet", [{ url: "" }]);
            }

            // 3. Move
            setStep(nextStep);
        }
        return isValid;
    };

    async function addLink() {
        const isValid = await handleNext()
        setHasLink(isValid);
    };

    function handleClose() {
        form.reset()
        onClose()
    }

    async function handleSubmit(values: FullFleetForm) {
        form.clearErrors()
        const fields: FieldPath<FullFleetForm>[] = [
            "truck.regPlate",
            "truck.brand",
            "truck.model",
            "truck.year",
            "truck.vin",
            "truck.booklet",
            "truck.license",
        ]

        if (values.truck.type === "articulated") {
            fields.push(
                "trailer.regPlate",
                "trailer.brand",
                "trailer.model",
                "trailer.year",
                "trailer.vin",
                "trailer.booklet",
                "trailer.license",
                "trailer.loadingBay.width",
                "trailer.loadingBay.length",
                "trailer.loadingBay.height",
                "trailer.loadingBay.volume",
                "trailer.loadingBay.capacity",
                "trailer.loadingBay.type",
            )

            if (hasLink) {
                fields.push(
                    "link.regPlate",
                    "link.brand",
                    "link.model",
                    "link.year",
                    "link.vin",
                    "link.booklet",
                    "link.license",
                    "link.loadingBay.width",
                    "link.loadingBay.length",
                    "link.loadingBay.height",
                    "link.loadingBay.volume",
                    "link.loadingBay.capacity",
                    "link.loadingBay.type",
                )
            }
        } else {
            fields.push(
                "truck.loadingBay.width",
                "truck.loadingBay.length",
                "truck.loadingBay.height",
                "truck.loadingBay.volume",
                "truck.loadingBay.capacity",
                "truck.loadingBay.type",
            )
        }

        console.log(values)
        const isValid = await form.trigger(fields, { shouldFocus: true });
        if (isValid) await save.mutateAsync({
            truck: values.truck,
            trailer: values.trailer,
            link: values.link
        })
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
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl gap-0 flex flex-col max-h-[80vh]">
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
                    <form>
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
                                        type="button"
                                        onClick={() => handleSubmit(form.getValues())}
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
