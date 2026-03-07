"use client"

import { z } from "zod"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { IconTruck, IconUser, IconX } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useRegisterDriver } from "../../../hooks/use-register-driver"
import { RegisterDriverForm } from "../form/register-driver-form"

export function RegisterDriverDialog() {
    const t = useTranslations("Carrier.company.drivers.dialog.register")
    const { isOpen, onClose } = useRegisterDriver()

    const RegisterDriverSchema = z.object({
        name: z.string(),
        email: z.email(),
        country: z.string().nonempty(),
        phoneNumber: z.string().min(9).max(15),
        driverLicense: z.array(z.object({ url: z.url() })).min(1).max(2),
        passportCard: z.array(z.object({ url: z.url() })).length(1).optional(),
    })

    type RegisterDriverForm = z.infer<typeof RegisterDriverSchema>

    const form = useForm<RegisterDriverForm>({
        resolver: zodResolver(RegisterDriverSchema),
        defaultValues: {
            country: "Mozambique",
            driverLicense: [{ url: "" }],
            passportCard: [{ url: "" }]
        }
    })

    function handleClose() {
        form.reset()
        onClose()
    }

    function handleSubmit(values: RegisterDriverForm) {
        form.clearErrors()
        window.alert(values)
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl gap-0 flex flex-col max-h-9/12">
                <DialogHeader className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconTruck className="size-5 text-primary" />
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
                                    {t("footer.cancel")}
                                </Button>

                                <Button
                                    type="submit"
                                >
                                    <IconUser />
                                    {t("footer.register")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
