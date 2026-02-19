"use client"

import Link from "next/link"
import { useTranslations } from "next-intl";
import { IconArrowLeft } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccountHeader() {
    const t = useTranslations("Shipper.account.header")
    const pathname = usePathname()
    const router = useRouter()

    const pages = [
        {
            path: "/s/account/profile",
            label: t("pages.profile"),
        },
        {
            path: "/s/account/company",
            label: t("pages.company"),
        },
        {
            path: "/s/account/security-and-privacy",
            label: t("pages.security-and-privacy"),
        },
        {
            path: "/s/account/billing",
            label: t("pages.billing"),
        },
    ]

    return (
        <header className="bg-sidebar sticky top-0 z-50 flex items-center border border-sidebar-border shadow-sm">
            <div className="flex flex-col h-(--header-height) max-w-5xl mx-auto w-full gap-4 justify-start pt-4">
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

                <div className="flex">
                    {pages.map(({ path, label }) => (
                        <Link
                            key={path}
                            href={path}
                            className={cn(
                                "flex px-4 pb-2 text-sm text-muted-foreground items-center",
                                pathname.startsWith(path) && "border-b-2 border-primary"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
