"use client"

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { IconArrowRight, IconCancel } from "@tabler/icons-react";

export const useConfirm = (translations: string) => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    const t = useTranslations(translations)

    const confirm = () => new Promise((resolve) => {
        setPromise({ resolve })
    })

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const ConfirmationDialog: unknown = () => (
        <Dialog open={promise !== null}>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-xl font-bold">{t("title")}</DialogTitle>
                    <DialogDescription className="pt-2">{t("description")}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        <IconCancel />
                        {t("button.cancel")}
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleConfirm}
                    >
                        {t("button.confirm")}
                        <IconArrowRight />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [ConfirmationDialog, confirm];
}