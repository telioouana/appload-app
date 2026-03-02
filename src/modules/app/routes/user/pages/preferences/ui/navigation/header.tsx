"use client"

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function PreferencesHeader() {
    const t = useTranslations("Shipper.preferences.header")
    const router = useRouter()

    return (
        <header className="bg-sidebar sticky top-0 z-50 flex items-center border border-sidebar-border shadow-sm">
            <div className="flex flex-col h-(--header-height) max-w-5xl mx-auto w-full gap-4 justify-start py-4">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        <IconArrowLeft />
                        {t("buttons.back")}
                    </Button>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold">{t("title")}</h3>
                        <h5 className="text-sm text-muted-foreground">{t("description")}</h5>
                    </div>
                </div>
            </div>
        </header>
    )
}
