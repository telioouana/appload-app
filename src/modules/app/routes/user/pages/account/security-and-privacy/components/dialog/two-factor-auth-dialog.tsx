"use client"

import { z } from "zod"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { IconX } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import { authClient } from "@/backend/auth/auth-client"

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { DefaultView } from "./views/default-view"
import { TFA, TwoFactorData } from "../../types/types"
import { BackupCodesView } from "./views/backup-codes-view"
import { VerificationView } from "./views/verification-view"
import { TwoFactorPassword } from "../../schemas/two-factor"
import { useTwoFactorAuth } from "../../hooks/use-two-factor-auth"

export function TwoFactorAuthDialog() {
    const [view, setView] = useState<TFA>("default")
    const [tfd, setTFD] = useState<TwoFactorData | null>(null)

    const t = useTranslations("User.account.security-and-privacy.security.two-factor.dialog")
    const { isEnabled, isOpen, onClose } = useTwoFactorAuth()
    const router = useRouter()

    const TwoFactorSchema = useMemo(() => TwoFactorPassword(t), [t])
    type TwoFactorForm = z.infer<typeof TwoFactorSchema>

    const form = useForm<TwoFactorForm>({
        resolver: zodResolver(TwoFactorSchema)
    })

    function handleClose() {
        setView("default")
        form.reset()
        onClose()
    }

    async function handleDisable(values: TwoFactorForm) {
        await authClient.twoFactor.disable(
            values,
            {
                onSuccess: () => {
                    handleClose()
                    router.refresh()
                },
                onError: ({ error }) => {
                    // TODO: Internationalization
                    toast.error(error.message || "Failed to disable 2FA")
                }
            })

    }

    async function handleEnable(values: TwoFactorForm) {
        const { data, error } = await authClient.twoFactor.enable(values)
        if (error) {
            // TODO: Internationalization
            toast.error(error.message || "Failed to enable 2FA")
            return
        }

        if (!data) {
            // TODO: Internationalization
            toast.error("Something went wrong")
            return
        }

        setTFD(data)
        setView("verification")
    }

    const views = [
        {
            id: "default",
            render: (
                <FormProvider {...form} key={"default"} >
                    <form onSubmit={form.handleSubmit(isEnabled ? handleDisable : handleEnable)}>
                        <DefaultView isEnabled={isEnabled} />
                    </form>
                </FormProvider>
            )
        },
        {
            id: "verification",
            render: tfd && <VerificationView key={"verification"} tfd={tfd} setView={setView} />
        },
        {
            id: "backup-codes",
            render: tfd && <BackupCodesView key={"backup-codes"} tfd={tfd} handleClose={handleClose} />
        }
    ]

    return (
        <Dialog open={isOpen} >
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{t(`header.title.${isEnabled}`)}</DialogTitle>
                    <DialogClose
                        onClick={handleClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                {views.map(({ id, render }) => {
                    return id === view && render
                })}
            </DialogContent>
        </Dialog>
    )
}
