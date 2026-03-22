"use client"

import { z } from "zod"
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { IconX } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/backend/trpc/client";
import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import { useIsMobile } from "@/hooks/use-mobile";

import { useEdgeStore } from "@/lib/edgestore";
import { countryCodes } from "@/lib/country-codes";

import { View } from "../../types/types";
import { KYCDetailsForm } from "../form/kyc-details-form";
import { OrganizationSchema, TYPE } from "../../schemas/organization";
import { useCreateOrganization } from "../../hooks/use-create-organization";
import { OrganizationDetailsForm } from "../form/organization-details-form";

interface Props {
    type: typeof TYPE[number]
}

export function CreateOrganizationDialog({ type }: Props) {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [isChecking, setChecking] = useState<boolean>(false)
    const [view, setView] = useState<View>("organization")

    const k = useTranslations("User.account.organization.form.register")
    const t = useTranslations("User.account.organization.create.dialog")
    const { edgestore } = useEdgeStore()
    const client = useQueryClient()
    const isMobile = useIsMobile()
    const trpc = useTRPC()

    const { isOpen, onClose } = useCreateOrganization()

    const CreateOrganizationSchema = useMemo(
        () => OrganizationSchema(k),
        [k]
    )

    type CreateOrganizationForm = z.infer<typeof CreateOrganizationSchema>

    const form = useForm<CreateOrganizationForm>({
        resolver: zodResolver(CreateOrganizationSchema),
        defaultValues: {
            info: {
                country: "Mozambique",
                type,
            },
            kyc: {
                nuit: [{ url: "" }],
                idCard: [{ url: "" }],
                commercialCertificate: [{ url: "" }],
                ...(type === "carrier" && {
                    fiscalRegime: "normal",
                    alvara: [{ url: "" }],
                    bankLetter: [{ url: "" }],
                    republicBulletin: [{ url: "" }],
                    commercialExercise: [{ url: "" }],
                })
            }
        }
    })

    const kyc = useMutation(
        trpc.organization.legal.mutationOptions({
            onSuccess: async () => {
                const kyc = form.getValues().kyc;
                const isShipper = form.getValues().info.type === "shipper";

                const uploads = [
                    ...kyc.idCard.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                    ...kyc.nuit.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                ];

                if (isShipper || kyc.commercialCertificate.length > 0) {
                    uploads.push(...kyc.commercialCertificate.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })));
                } else {
                    uploads.push(
                        ...kyc.alvara.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                        ...kyc.bankLetter.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                        ...kyc.republicBulletin.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                        ...kyc.commercialExercise.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                    );
                }

                await Promise.all(uploads);
            },
            onError: (error) => {
                // TODO: Implement localization
                toast.error(error.message || "Something went wrong when saving the documents")
            }
        })
    )

    function handleClose() {
        form.reset()
        onClose()
    }

    function handleBack() {
        setView("organization")
    }

    async function handleNext() {
        form.clearErrors()

        const fields: FieldPath<CreateOrganizationForm>[] = [
            "info.name", "info.nuit", "info.email", "info.phoneNumber",
            "info.billingAddress.address", "info.physicalAddress.address"
        ];

        const isValid = await form.trigger(fields, { shouldFocus: true });

        if (isValid) {
            setChecking(true);
            try {
                const phone = `${countryCodes.find(({ country }) => country === form.getValues().info.country)?.code ?? ""}${form.getValues().info.phoneNumber}`

                const result = await client.fetchQuery(
                    trpc.organization.validate.queryOptions({
                        phoneNumber: phone,
                        nuit: form.getValues().info.nuit,
                        email: form.getValues().info.email,
                    })
                );

                const { hasEmail, hasPhone, hasNuit } = result

                if (hasNuit || hasEmail || hasPhone) {
                    if (hasNuit) form.setError("info.nuit", { message: k("info.nuit.error.conflict") });
                    if (hasEmail) form.setError("info.email", { message: k("info.email.error.conflict") });
                    if (hasPhone) form.setError("info.phoneNumber", { message: k("info.phone-number.error.conflict") });
                    return;
                }

                setView("kyc");
            } catch (error) {
                console.error("Manual fetch failed:", error);
            } finally {
                setChecking(false);
            }
        }
    }

    async function handleSubmit() {
        form.clearErrors()
        let fields: FieldPath<CreateOrganizationForm>[] = []

        if (form.getValues().info.type === "shipper") {
            fields = ["kyc.idCard", "kyc.nuit", "kyc.commercialCertificate"]
        } else {
            fields = ["kyc.idCard", "kyc.nuit", "kyc.fiscalRegime", "kyc.alvara", "kyc.bankLetter", "kyc.commercialExercise", "kyc.republicBulletin"]
        }

        const isValid = await form.trigger(fields, { shouldFocus: true });

        if (!isValid) return
        
        setSubmitting(true)
        const org = {
            type: form.getValues().info.type,
            name: form.getValues().info.name,
            slug: form.getValues().info.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            nuit: form.getValues().info.nuit,
            email: form.getValues().info.email,
            phoneNumber: `${countryCodes.find(({ country }) => country === form.getValues().info.country)?.code ?? ""}${form.getValues().info.phoneNumber}`,
            billingAddress: form.getValues().info.billingAddress,
            physicalAddress: form.getValues().info.physicalAddress,
        }
        let organizationId: string | undefined

        try {
            const { data, error } = await authClient.organization.create({
                status: "pending",
                subscriptionPlan: "free",
                ...org
            })

            if (error) {
                // TODO: Implement localization
                toast.error(error.message || "Something went wrong")
                return
            }

            organizationId = data.id

            await kyc.mutateAsync({
                organizationId,
                values: form.getValues().kyc
            })

            await authClient.organization.setActive({
                organizationId
            })
        } catch (error) {
            console.error(error)
            if (organizationId) {
                await authClient.organization.delete({ organizationId })
            }
            // TODO: Implement localization
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const views = [
        {
            id: "organization",
            render: <div key={"organization-info"} className="px-1"><OrganizationDetailsForm /></div>
        },
        {
            id: "kyc",
            render: <div key={"kyc-info"} className="px-1"><KYCDetailsForm /></div>
        }
    ]

    if (isMobile) {
        return (
            <Drawer open={isOpen}>
                <DrawerContent >
                    <DrawerHeader>
                        <DrawerTitle className="text-xl font-semibold">{t("title")}</DrawerTitle>
                        <DrawerClose
                            onClick={handleClose}
                            className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <IconX className="size-4" />
                            <span className="sr-only">Close</span>
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="max-h-[70vh]">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <div className="max-h-[50vh] overflow-y-scroll container-snap mb-6">
                                    {views.map(({ id, render }) => {
                                        return id === view && render
                                    })}
                                </div>
                            </form>
                        </FormProvider>

                        <DrawerFooter>
                            {view === "organization"
                                ? (
                                    <>
                                        <div className="w-full">
                                            <Button
                                                type="button"
                                                className="w-full"
                                                variant="destructive"
                                                onClick={handleClose}
                                            >
                                                {t("actions.cancel")}
                                            </Button>
                                        </div>

                                        <div className="w-full">
                                            <Button
                                                type="button"
                                                className="w-full"
                                                onClick={handleNext}
                                                disabled={isChecking}
                                            >
                                                {t("actions.next")}
                                            </Button>
                                        </div>

                                    </>
                                ) : (
                                    <>
                                        <div className="w-full">
                                            <Button
                                                type="button"
                                                className="w-full"
                                                variant="outline"
                                                onClick={handleBack}
                                            >
                                                {t("actions.back")}
                                            </Button>
                                        </div>

                                        <div className="w-full">
                                            <Button
                                                type="button"
                                                className="w-full"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {t("actions.register")}
                                            </Button>
                                        </div>
                                    </>
                                )
                            }
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={isOpen} >
            <DialogContent showCloseButton={false} className="md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{t("title")}</DialogTitle>

                    <DialogClose
                        onClick={handleClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="max-h-[70vh]">
                    <FormProvider {...form}>
                        <form>
                            <div className="max-h-[60vh] overflow-y-scroll container-snap mb-6">
                                {views.map(({ id, render }) => {
                                    return id === view && render
                                })}
                            </div>
                        </form>
                    </FormProvider>

                    <DialogFooter>
                        <div className="flex justify-between items-center w-full">
                            <div className="w-full" />
                            <div className="flex justify-between items-center w-full gap-2">
                                {view === "organization"
                                    ? (
                                        <>
                                            <div className="w-full">
                                                <Button
                                                    type="button"
                                                    className="w-full"
                                                    variant="destructive"
                                                    onClick={handleClose}
                                                >
                                                    {t("actions.cancel")}
                                                </Button>
                                            </div>

                                            <div className="w-full">
                                                <Button
                                                    type="button"
                                                    className="w-full"
                                                    onClick={handleNext}
                                                    disabled={isChecking}
                                                >
                                                    {t("actions.next")}
                                                </Button>
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div className="w-full">
                                                <Button
                                                    type="button"
                                                    className="w-full"
                                                    variant="outline"
                                                    onClick={handleBack}
                                                >
                                                    {t("actions.back")}
                                                </Button>
                                            </div>

                                            <div className="w-full">
                                                <Button
                                                    type="button"
                                                    className="w-full"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                >
                                                    {t("actions.register")}
                                                </Button>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
