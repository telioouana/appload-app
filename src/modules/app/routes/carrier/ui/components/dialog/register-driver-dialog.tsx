"use client"

import { z } from "zod"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { IconTruck, IconUser, IconX } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client"
import { authClient } from "@/backend/auth/auth-client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { RegisterDriverForm } from "../form/register-driver-form"
import { useRegisterDriver } from "../../../hooks/use-register-driver"

import { useEdgeStore } from "@/lib/edgestore"
import { countryCodes } from "@/lib/country-codes"
import { DEFAULT_PAGE_LIMIT } from "@/constants"

function DriverSchema(t: (key: string) => string) {
    const schema = z.object({
        name: z.string({ error: t("form.name.error") }).nonempty({ error: t("form.name.error") }),
        email: z.email({ error: t("form.email.error.empty") }),
        country: z.string(),
        phoneNumber: z.string({ error: t("form.phone-number.error.empty") }).min(9, { error: t("form.phone-number.error.invalid") }).max(15, { error: t("form.phone-number.error.invalid") }),
        driverLicense: z.array(z.object({ url: z.url({ error: t("form.driver-license.error") }) })).min(1).max(2),
        passportCard: z.array(z.object({ url: z.url() })).max(1),
    })

    return schema
}

export const RegisterDriverSchema = DriverSchema((k: string) => k)
export type RegisterDriverForm = z.infer<typeof RegisterDriverSchema>

export function RegisterDriverDialog() {
    const t = useTranslations("Carrier.company.drivers.dialog")
    const { isOpen, onClose } = useRegisterDriver()

    const RegisterDriverSchema = useMemo(() => DriverSchema(t), [t])

    const form = useForm<RegisterDriverForm>({
        resolver: zodResolver(RegisterDriverSchema),
        defaultValues: {
            country: "Mozambique",
            driverLicense: [{ url: "" }],
            passportCard: [{ url: "" }]
        }
    })

    const queryClient = useQueryClient()
    const { edgestore } = useEdgeStore()
    const trpc = useTRPC()

    const register = useMutation(
        trpc.driver.register.mutationOptions({
            onSuccess: async () => {
                const { driverLicense, passportCard } = form.getValues()
                const uploads = [
                    ...driverLicense.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                ]

                if (passportCard && passportCard.length > 0) {
                    uploads.push(
                        ...passportCard.map(({ url }) => edgestore.apploadFiles.confirmUpload({ url })),
                    )
                }

                await Promise.all(uploads)

                queryClient.invalidateQueries(trpc.driver.drivers.infiniteQueryOptions({
                    limit: DEFAULT_PAGE_LIMIT
                }))
                handleClose()
            },
            onError: (error) => {
                // TODO: Display proper message with internationalization
                console.log(error)
            }
        })
    )

    function handleClose() {
        form.reset()
        onClose()
    }

    async function handleSubmit(values: RegisterDriverForm) {
        form.clearErrors()
        const phoneNumber = `${countryCodes.find(({ country }) => country === values.country)?.code ?? ""}${values.phoneNumber}`
        const result = await authClient.signUp.email({
            email: values.email,
            password: `@Driver_${values.phoneNumber}`,
            name: values.name,
            type: "driver",
            phoneNumber: phoneNumber,
        })

        if (!result.data) {
            // TODO: Display proper message with internationalization
            console.log(result.error)
            return
        }

        const { data: user } = result

        await register.mutateAsync({
            userId: user.user.id,
            driverLicense: values.driverLicense,
            passportCard: values.passportCard
        })
    }

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
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <RegisterDriverForm />

                        <DialogFooter className="border-t p-6">
                            <div className="flex justify-end items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                >
                                    {t("register.footer.cancel")}
                                </Button>

                                <Button
                                    type="submit"
                                >
                                    <IconUser />
                                    {t("register.footer.register")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
