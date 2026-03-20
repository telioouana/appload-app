"use client"

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"
import { IconChecks } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

import { TwoFactorData } from "../../../types/types"

interface Props {
    tfd: TwoFactorData
    handleClose: () => void
}

export function BackupCodesView({ tfd, handleClose }: Props) {
    const t = useTranslations("User.account.security-and-privacy.security.two-factor.dialog.form.backup-codes-view")
    const router = useRouter()
    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-bold text-lg">{t("title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("note")}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {tfd.backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm">
                        {code}
                    </div>
                ))}
            </div>

            <Button
                type="button"
                value="success"
                className="w-full"
                onClick={() => {
                    handleClose()
                    router.refresh()
                }}
            >
                <IconChecks />
                {t("actions.done")}
            </Button>
        </div>
    )
}
